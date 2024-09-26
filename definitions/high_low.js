module.exports = (tags, dependencies, input_table_name,preprocessing_stop) => {
    const sma_table = constants.prefix+input_table_name + '_high_low'+constants.suffix
    const table_name_function = publish(sma_table, {
        type: "table",
        tags: tags,
        dependencies: dependencies
    }).query(ctx => {
        let query = ``
        query = `
            SELECT
                TIMESTAMP,
                Datetime,
                close,
                -- High,
                -- Low,
                ROUND(high - low, 2) AS high_low,
                ROUND((close - LAG(close, 1) OVER (ORDER BY Datetime)), 2) AS diff_close
            FROM
                ${ctx.ref(preprocessing_stop)}
            ORDER BY DATETIME
            `;
        return query;
    });

    return sma_table
};
