module.exports = (tags, dependencies, input_table_name, sma_table,column="Close") => {
    const lag_table =  constants.prefix+input_table_name + '_LAG'+constants.suffix
    const table_name_function = publish(lag_table, {
        type: "table",
        tags: tags,
        // dependencies: dependencies
    }).query(ctx => {
        let query = ``
        query = `
            SELECT 
                TIMESTAMP,
                Datetime,
                Close,
                `
        for(let day=1;day<=25;day++){
            query += `LAG(${column}, ${day}) OVER (ORDER BY Datetime) AS ${column}_t_${day},`
        }
        query += `
            FROM 
                ${ctx.ref(sma_table)}
            ORDER BY 
                Datetime
            `;
        return query;
    });

    return lag_table
};
