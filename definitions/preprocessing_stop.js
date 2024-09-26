module.exports = (tags, dependencies, stock_name,formated_stock_name) => {
    const preprocessing_stop = constants.prefix+formated_stock_name + '_FORMATTED'+constants.suffix
    const table_name_function = publish(preprocessing_stop, {
        type: "table",
        tags: tags,
        // dependencies: dependencies,
    }).query(ctx => {
        let query = ``
        query = `
            SELECT
                TIMESTAMP_MICROS(CAST(datetime / 1000 AS INT64)) AS TIMESTAMP,
                *
                FROM
                ${constants.project}.${constants.dtset}.${stock_name}
                ORDER BY DATETIME
            `;
        return query;
    });

    return preprocessing_stop
};
