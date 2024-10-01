module.exports = (tags, dependencies, stock_name,stock_table,formated_stock_table) => {
    const preprocessing_stop = constants.prefix+formated_stock_table + '_FORMATTED'+constants.suffix
    const table_name_function = publish(preprocessing_stop, {
        type: "table",
        tags: tags,
        // dependencies: dependencies,
    }).query(ctx => {
        let query = ``
        query = `
            SELECT
                TIMESTAMP_MICROS(CAST(Datetime / 1000 AS INT64)) AS TIMESTAMP,
                '${stock_name}' as stock_name,
                *
                FROM
                ${constants.project}.${constants.dtset}.${stock_table}
                ORDER BY DATETIME
            `;
        return query;
    });

    return preprocessing_stop
};
