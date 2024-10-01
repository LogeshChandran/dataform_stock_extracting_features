module.exports = (tags, dependencies, stock_name,input_table_name,preprocessing_stop) => {
    const sma_table = constants.prefix+input_table_name + '_SMA'+constants.suffix
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
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 4 PRECEDING AND CURRENT ROW),2) AS sma_5d,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 9 PRECEDING AND CURRENT ROW),2) AS sma_10d,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 14 PRECEDING AND CURRENT ROW),2) AS sma_15d,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 20 PRECEDING AND CURRENT ROW),2) AS sma_1mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 41 PRECEDING AND CURRENT ROW),2) AS sma_2mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 49 PRECEDING AND CURRENT ROW),2) AS sma_50d,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 62 PRECEDING AND CURRENT ROW),2) AS sma_3mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 125 PRECEDING AND CURRENT ROW),2) AS sma_6mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 189 PRECEDING AND CURRENT ROW),2) AS sma_9mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 255 PRECEDING AND CURRENT ROW),2) AS sma_12mo,
            FROM
                ${ctx.ref(preprocessing_stop)}
            ORDER BY DATETIME
            `;
        return query;
    });

    return sma_table
};
