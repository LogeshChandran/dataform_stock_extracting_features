function main(){
    
    let tags = []
    const get_from_yfinace_function = require('./get_from_yfinace');
    let input_table_name = "INFY_1d"
    const { get_from_yfinace } = get_from_yfinace_function(tags,input_table_name)

}

main()