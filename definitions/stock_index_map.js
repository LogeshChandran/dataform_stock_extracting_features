module.exports = (tags, dependencies, stock_name, input_table_name, index_final_table_list, time_frame) => {
    const final_table_stock_mapping = constants.prefix + input_table_name + '_stock_mapping' + constants.suffix
    const table_name_function_bf = publish(final_table_stock_mapping, {
        type: "table",
        tags: tags,
        dependencies: dependencies
    }).query(ctx => {
        let query = ``
        let select_query = `
            select stock.*, 
            `
        let from_query = ` from \`india.${input_table_name}_column_name_change\` stock `
        for (let ind in index_final_table_list) {
            if (stock_index_map[stock_name] && stock_index_map[stock_name].includes(ind)) {
                let table_name = index_final_table_list[ind]
                // let alias_name = index_final_table_list[ind][1]
                select_query =select_query + `${ind}.*EXCEPT(${ind}${time_frame}_Datetime), `
                from_query = from_query + `left join
                                    \`india.${table_name}\` ${ind}
                                    on stock.${input_table_name}_Datetime=${ind}.${ind}${time_frame}_Datetime `
            }
        }
        query = select_query + from_query;
        return query;
    });

    let targeted_columns = []
    const final_table = constants.prefix + input_table_name + '_final' + constants.suffix
    const table_name_function = publish(final_table, {
        type: "table",
        tags: tags,
        dependencies: final_table_stock_mapping
    }).query(ctx => {
        let query = ``
        query = `SELECT
                    *, --except(${input_table_name}_Close),
                    LEAD(${input_table_name}_Close, 1) OVER (ORDER BY ${input_table_name}_Datetime) AS Target_Close
                FROM
                   ${ctx.ref(final_table_stock_mapping)}
                -- ORDER BY ${input_table_name}_Datetime
                `
        return query;
    });




    return final_table
};
