const bcrypt = require("bcrypt");
const saltRounds = 10;

function generatePassword(password) {
  return bcrypt.hashSync(password, saltRounds);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

const checkLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
  next();
};

async function generateInvoice(sequelize) {
  try {
    const [results] = await sequelize.query('SELECT purchase_invoice() as invoice_number');
    return results[0].invoice_number;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    throw new Error('Failed to generate invoice number');
  }
}

function formatCurrency(amount) {
  if (!amount && amount !== 0) return 'Rp 0,00';

  const num = parseFloat(amount);
  if (isNaN(num)) return 'Rp 0,00';
  const formatted = num.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `Rp ${formatted}`;
}

module.exports = {
  generatePassword,
  comparePassword,
  checkLogin,
  generateInvoice,
  formatCurrency,
};