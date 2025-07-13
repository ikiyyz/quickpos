'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS sales_invoice_seq;
    `);

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION sales_invoice()
      RETURNS VARCHAR AS $$
      DECLARE
          today TEXT := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
          prefix TEXT := 'INV-PENJ' || today || '-';
          last_invoice TEXT;
          seq_val INT;
          last_seq TEXT;
      BEGIN
          SELECT invoice INTO last_invoice
          FROM public.sales
          WHERE invoice LIKE 'INV-PENJ' || today || '-%'
          ORDER BY invoice DESC
          LIMIT 1;

          IF last_invoice IS NOT NULL THEN
              -- Ambil nomor urut dari bagian paling belakang invoice
              last_seq := SPLIT_PART(last_invoice, '-', array_length(string_to_array(last_invoice, '-'), 1));
              seq_val := COALESCE(CAST(last_seq AS INT), 0) + 1;
          ELSE
              seq_val := 1;
          END IF;

          RETURN prefix || seq_val::TEXT;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS sales_invoice();
    `);
    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS sales_invoice_seq;
    `);
  }
}; 