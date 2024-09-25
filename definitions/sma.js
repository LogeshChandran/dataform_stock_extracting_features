// module.exports = (tags, dependencies, input_table_name) => {
module.exports = (tags, dependencies, preprocessing_stop) => {
    const output_table_name = `tcs_sd`
    const table_name_function = publish(output_table_name, {
        type: "table",
        tags: tags,
        // dependencies: dependencies
    }).query(ctx => {
        let query = ``
        query = `
            SELECT
                Datetime,
                close,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 4 PRECEDING AND CURRENT ROW),2) AS sma_5d,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 9 PRECEDING AND CURRENT ROW),2) AS sma_10d,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 14 PRECEDING AND CURRENT ROW),2) AS sma_15d,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 20 PRECEDING AND CURRENT ROW),2) AS sma_1mo,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 41 PRECEDING AND CURRENT ROW),2) AS sma_2mo,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 62 PRECEDING AND CURRENT ROW),2) AS sma_3mo,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 125 PRECEDING AND CURRENT ROW),2) AS sma_6mo,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 189 PRECEDING AND CURRENT ROW),2) AS sma_9mo,
                -- round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 255 PRECEDING AND CURRENT ROW),2) AS sma_12mo,
            FROM
                ${ctx.ref(preprocessing_stop)}
                -- ${constants.project}.${constants.dtset}.${preprocessing_stop}
            `;
        return query;
    });

    return {
        output_table_name
    }
};
