function main() {

    let tags = []
    let dependencies = []

    let input_table_name = "INFY_60m"
    const preprocessing_stop_function = require('./preprocessing_stop');
    const sma_function = require('./sma');


    const {
        preprocessing_stop
    } = preprocessing_stop_function(tags, dependencies, input_table_name);
    
    const {
        sma
    } = sma_function(tags, preprocessing_stop, preprocessing_stop);

}

main()
