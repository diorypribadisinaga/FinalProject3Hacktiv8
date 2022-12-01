const convertRupiah = require("rupiah-format")

function Convert(rupiah) {
  return convertRupiah.convert(rupiah)
}

module.exports = Convert