project = 'stock-data-436605'
dtset = 'india'
prefix = ""
suffix = ""

index_list = {
    "^NSEI": "NIFTY",
    "^CNXIT": "NIFTY_IT",
    "^CNX100": "NIFTY_100",
    "^CNXAUTO": "NIFTY_AUTO"
}
stock_index_map = {
    "INFY": ["NIFTY", "NIFTY_IT", "NIFTY_100"],
    "TCS": ["NIFTY", "NIFTY_IT", "NIFTY_100"]
}
stock_name_list = ["INFY", "TCS"]
module.exports = {
    project,
    dtset,
    prefix,
    suffix,
    index_list,
    stock_index_map,
    stock_name_list
};
