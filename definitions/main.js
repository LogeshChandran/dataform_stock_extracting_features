function main() {

    const preprocessing_step_function = require('./preprocessing_step');
    const sma_function = require('./sma');
    const lag_function = require('./lag');
    const column_name_change_function = require("./column_name_change")
    const high_low_function = require("./high_low")
    const combine_table_function = require("./combine_table")
    const stock_index_map_function = require("./stock_index_map")
    const bf_train_model_function = require("./boosted_tree_train_model")
    const automl_train_model_function = require("./automl_train_model")

    // if (constants.stock_name_list.length > 0) {
    //     return;  // Exits the function if stock_name_list is not empty
    // }
    let tags = []
    let dependencies = []
    let time_frame = "_60m"
    let index_final_table_list = {}
    let index_final_table_dependencies = []
    for (let ind in constants.index_list) {
        let combine_table_list = []
        let combine_table_dependencies = []
        let index_name = constants.index_list[ind]
        let index_table_name = index_name + time_frame
        let preprocessing_step_index = preprocessing_step_function(["preprocessing", index_name], dependencies, index_name, index_table_name, index_table_name);

        let sma_table_index = sma_function(["SMA", index_name], preprocessing_step_index, index_name, index_table_name, preprocessing_step_index);
        let lag_table = lag_function(["LAG", index_name], preprocessing_step_index, index_name, index_table_name, preprocessing_step_index);
        let high_low_table = high_low_function(["high_low", index_name, index_table_name], preprocessing_step_index, index_name, index_table_name, preprocessing_step_index);
        let lag_high_low_table = lag_function(["LAG", index_name, index_table_name + "_high_low"], high_low_table, index_name, index_table_name + "_high_low", high_low_table, "high_low");
        let lag_diff_close_table = lag_function(["LAG", index_name, index_table_name + "_diff_close"], [lag_high_low_table, high_low_table], index_name,index_table_name + "_diff_close", high_low_table, "diff_close");

        combine_table_dependencies.push(sma_table_index)
        combine_table_dependencies.push(lag_table)
        combine_table_dependencies.push(high_low_table)
        combine_table_dependencies.push(lag_high_low_table)
        combine_table_dependencies.push(lag_diff_close_table)

        combine_table_list.push([sma_table_index,"sma"])
        combine_table_list.push([lag_table,"lag"])
        combine_table_list.push([high_low_table,"high_low"])
        combine_table_list.push([lag_high_low_table,"lag_high_low"])
        combine_table_list.push([lag_diff_close_table,"lag_diff_close"])

        let combine_table_table = combine_table_function(["COMBINE_ALL", index_name],combine_table_dependencies,index_name,index_table_name,combine_table_list)
        let column_name_change_table = column_name_change_function(["COLUMN_NAME", index_name], combine_table_table, index_name, index_table_name, combine_table_table);
        
        index_final_table_list[index_name] = column_name_change_table;
        index_final_table_dependencies.push(column_name_change_table)
    }

    let stock_name = "INFY"
    for(let ind in constants.stock_name_list){
        let stock_name = constants.stock_name_list[ind]
        let stock_table_name = stock_name + time_frame
        let preprocessing_stop = preprocessing_step_function(["preprocessing", stock_name], dependencies, stock_name, stock_table_name, stock_table_name);

        let sma_table = sma_function(["SMA", stock_name, stock_table_name], preprocessing_stop, stock_name,stock_table_name, preprocessing_stop);
        // will add last compoent
        let lag_table = lag_function(["LAG", stock_name, stock_table_name], preprocessing_stop, stock_name, stock_table_name, preprocessing_stop);
        let high_low_table = high_low_function(["high_low", stock_name, stock_table_name], preprocessing_stop, stock_name, stock_table_name, preprocessing_stop);
        let lag_high_low_table = lag_function(["LAG", stock_name, stock_table_name + "_high_low"], high_low_table, stock_name, stock_table_name + "_high_low", high_low_table, "high_low");
        let lag_diff_close_table = lag_function(["LAG", stock_name, stock_table_name + "_diff_close"], [lag_high_low_table, high_low_table], stock_name,stock_table_name + "_diff_close", high_low_table, "diff_close");
        
        let stock_combine_table_list = []
        let stock_combine_table_dependencies = []
        stock_combine_table_dependencies.push(sma_table)
        stock_combine_table_dependencies.push(lag_table)
        stock_combine_table_dependencies.push(high_low_table)
        stock_combine_table_dependencies.push(lag_high_low_table)
        stock_combine_table_dependencies.push(lag_diff_close_table)

        stock_combine_table_list.push([sma_table,"sma"])
        stock_combine_table_list.push([lag_table,"lag"])
        stock_combine_table_list.push([high_low_table,"high_low"])
        stock_combine_table_list.push([lag_high_low_table,"lag_high_low"])
        stock_combine_table_list.push([lag_diff_close_table,"lag_diff_close"])

        let combine_table_table = combine_table_function(["COMBINE_ALL", stock_name],stock_combine_table_dependencies,stock_name,stock_table_name,stock_combine_table_list)
        let column_name_change_table = column_name_change_function(["COLUMN_NAME", stock_name], combine_table_table, stock_name, stock_table_name, combine_table_table);
        let temp_dependencies = index_final_table_dependencies.concat(column_name_change_table);
        let final_table = stock_index_map_function(["INDEX_MAP", stock_name],temp_dependencies, stock_name, stock_table_name, index_final_table_list,time_frame)
        let bf_train_model = bf_train_model_function(["BT_MODEL_TRAIN", stock_name],final_table,stock_name, stock_table_name, final_table,time_frame)
        let automl_train_model = automl_train_model_function(["BT_MODEL_TRAIN", stock_name],final_table,stock_name, stock_table_name, final_table,time_frame)
    }   
}

main()
