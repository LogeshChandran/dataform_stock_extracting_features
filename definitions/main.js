function main() {

    let tags = []
    let dependencies = []

    let time_frame = "_60m"
    let stock_name = "INFY"
    const preprocessing_stop_function = require('./preprocessing_stop');
    const sma_function = require('./sma');
    const lag_function = require('./lag');
    const index_price_mapping = require("./index_price")
    const high_low_function = require("./high_low")

    let stock_table_name = stock_name + time_frame
    let preprocessing_stop = preprocessing_stop_function(["preprocessing", stock_table_name], dependencies, stock_table_name, stock_table_name);

    for (let indiex in constants.index_list) {
        let index_table_name = constants.index_list[indiex] + time_frame
        let preprocessing_stop_index = preprocessing_stop_function(["preprocessing", index_table_name], dependencies, index_table_name, index_table_name);

        let sma_table_index = sma_function(["SMA", index_table_name], preprocessing_stop_index, index_table_name, preprocessing_stop_index);
        let lag_table = lag_function(["LAG", index_table_name], preprocessing_stop, index_table_name, preprocessing_stop_index);
    }

    let sma_table = sma_function(["SMA", stock_table_name], preprocessing_stop, stock_table_name, preprocessing_stop);
    // will add last compoent
    let lag_table = lag_function(["LAG", stock_table_name], preprocessing_stop, stock_table_name, preprocessing_stop);
    let high_low_table = high_low_function(["high_low", stock_table_name], preprocessing_stop, stock_table_name, preprocessing_stop);
    let lag_high_low_table = lag_function(["LAG", stock_table_name + "_high_low"], high_low_table, stock_table_name + "_high_low", high_low_table,"high_low");
    let lag_diff_close_table = lag_function(["LAG", stock_table_name + "_diff_close"], [lag_high_low_table,high_low_table], stock_table_name + "_diff_close", high_low_table,"diff_close");

}

main()
