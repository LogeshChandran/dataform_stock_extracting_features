module.exports = (tags, dependencies, stock_name,input_table_name,column_change_table_name) => {
    const column_name_change_table = constants.prefix+input_table_name + '_column_name_change'+constants.suffix
    const table_name_function = operate(column_name_change_table, {
        type: "operations",
        tags: tags,
        dependencies: dependencies
    }).queries(ctx => {
        let query = ``
        query =
        `
          EXECUTE IMMEDIATE FORMAT('''
          CREATE OR REPLACE TABLE ${constants.dtset}.${column_name_change_table} AS 
          SELECT %s from 
          ${ctx.ref(column_change_table_name)} ''',
          (WITH column_names AS (
            SELECT
              column_name
            FROM
              \`stock-data-436605.india.INFORMATION_SCHEMA.COLUMNS\`
            WHERE
              table_name = \'${column_change_table_name}\'
          )
          SELECT
            STRING_AGG(column_name || ' AS ${input_table_name}_' || column_name, ', ') AS prefixed_columns
          FROM
            column_names))
      `
        return query;
    });

    return column_name_change_table
};