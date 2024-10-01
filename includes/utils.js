function transpose_SAS(data1, by1,id_trans1, var1, suffix1 = '', out1 = null,input_final_table="",extra_code1='') {

    let query = ''
    query =
    `
      EXECUTE IMMEDIATE FORMAT('''
        CREATE OR REPLACE TABLE ${out1} AS 
        SELECT ${by1},%s from 
        ${input_final_table}''',
        (SELECT CONCAT('', STRING_AGG(DISTINCT CONCAT(feature)))  FROM ${data1} ${extra_code1}))
    `
    return query;
};

module.exports = {
    transpose_SAS
};