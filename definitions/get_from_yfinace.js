module.exports = (tags,input_table_name) => {
    const output_table_name = `tcs_sd`
    const table_name_function = publish(output_table_name, {
            type: "table",
            tags: tags,
        }).query(ctx => {
            let query = ``
            query= `
            SELECT
                Datetime,
                close,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 4 PRECEDING AND CURRENT ROW),2) AS sma_5d,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 9 PRECEDING AND CURRENT ROW),2) AS sma_10d,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 14 PRECEDING AND CURRENT ROW),2) AS sma_15d,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 20 PRECEDING AND CURRENT ROW),2) AS sma_1mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 41 PRECEDING AND CURRENT ROW),2) AS sma_2mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 62 PRECEDING AND CURRENT ROW),2) AS sma_3mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 125 PRECEDING AND CURRENT ROW),2) AS sma_6mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 189 PRECEDING AND CURRENT ROW),2) AS sma_9mo,
                round(avg(Close) OVER (ORDER BY Datetime ROWS BETWEEN 255 PRECEDING AND CURRENT ROW),2) AS sma_12mo,
            FROM
                \`${constants.project}.${constants.dtset}.${input_table_name}\`
            order by Datetime
            `;
            return query;
        });

    return { output_table_name }
};