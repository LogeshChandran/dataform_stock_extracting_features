module.exports = (tags, dependencies, input_table_name) => {
    const output_table_name = 'FORMATTED_' + input_table_name
    const table_name_function = publish(output_table_name, {
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
                ${constants.project}.${constants.dtset}.${input_table_name}
                ORDER BY DATETIME
            `;
        return query;
    });

    return {
        output_table_name
    }
};
