const { QueryInterface } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Function untuk update stock barang
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_goods_stock() RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE goods SET stock = stock + NEW.quantity WHERE barcode = NEW.itemcode;
        ELSIF TG_OP = 'UPDATE' THEN
          UPDATE goods SET stock = stock - OLD.quantity + NEW.quantity WHERE barcode = NEW.itemcode;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE goods SET stock = stock - OLD.quantity WHERE barcode = OLD.itemcode;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger untuk stock barang
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_update_goods_stock ON purchaseitems;
      CREATE TRIGGER trg_update_goods_stock
      AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
      FOR EACH ROW EXECUTE FUNCTION update_goods_stock();
    `);

    // Function untuk update totalsum di purchases
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_purchase_totalsum() RETURNS TRIGGER AS $$
      BEGIN
        UPDATE purchases SET totalsum = (
          SELECT COALESCE(SUM(totalprice),0) FROM purchaseitems WHERE invoice = NEW.invoice
        ) WHERE invoice = NEW.invoice;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger untuk update totalsum setelah perubahan purchaseitems
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_update_purchase_totalsum_insert ON purchaseitems;
      CREATE TRIGGER trg_update_purchase_totalsum_insert
      AFTER INSERT OR UPDATE ON purchaseitems
      FOR EACH ROW EXECUTE FUNCTION update_purchase_totalsum();
    `);
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_update_purchase_totalsum_delete ON purchaseitems;
      CREATE TRIGGER trg_update_purchase_totalsum_delete
      AFTER DELETE ON purchaseitems
      FOR EACH ROW EXECUTE FUNCTION update_purchase_totalsum();
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_update_goods_stock ON purchaseitems;');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_goods_stock();');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_update_purchase_totalsum_insert ON purchaseitems;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_update_purchase_totalsum_delete ON purchaseitems;');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_purchase_totalsum();');
  }
}; 