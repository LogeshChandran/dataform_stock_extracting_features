module.exports = (tags, dependencies, stock_name,input_table_name,combine_table_list) => {
    const sma_table = constants.prefix+input_table_name + '_combine_all'+constants.suffix
    const table_name_function = publish(sma_table, {
        type: "table",
        tags: tags,
        dependencies: dependencies
    }).query(ctx => {
        let query = ``
        let select_query = `
            SELECT
            stock.*,
            `
        let from_query =  `FROM stock-data-436605.india.${input_table_name}_FORMATTED as stock `
        for (let ind in combine_table_list) {
            let table_name = combine_table_list[ind][0]
            let alias_name = combine_table_list[ind][1]
            select_query =select_query + `${alias_name}.*EXCEPT(TIMESTAMP, Datetime, Close), `
            from_query = from_query + `LEFT JOIN ${ctx.ref(table_name)} as ${alias_name} ON stock.datetime=${alias_name}.datetime `
        }
        query = select_query + from_query;
        return query;
    });

    return sma_table
};
