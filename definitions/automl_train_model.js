module.exports = (tags, dependencies, stock_name, input_table_name, final_table, time_frame,target_cloumn = 'Target_Close') => {
    const tier1_model = constants.prefix + input_table_name + '_AUTOML_train_tier1_model' + constants.suffix
    const tier1_model_name = constants.dtset+'.'+constants.prefix + input_table_name + '_boosted_tree_regressor_tier1' + constants.suffix
    const tier1_model_function = operate(tier1_model, {
        type: "operations",
        tags: tags,
        dependencies: dependencies
    }).queries(ctx => {
        let query = ``
        query = `CREATE OR REPLACE MODEL
                    ${tier1_model_name}
                    OPTIONS(
                    model_type = 'automl_regressor',
                    input_label_cols = ['${target_cloumn}'],
                    -- data_split_method = 'random',
                    budget_hours = 1.0                        -- Time in hours to train the model, adjust as needed
                    ) AS
                    SELECT
                    * EXCEPT(
                        ${input_table_name}_TIMESTAMP,
                        ${input_table_name}_stock_name,
                        ${input_table_name}_Datetime,
                        NIFTY_60m_TIMESTAMP,
                        NIFTY_60m_stock_name,
                        -- NIFTY_60m_Datetime,
                        NIFTY_IT_60m_TIMESTAMP,
                        NIFTY_IT_60m_stock_name,
                        -- NIFTY_IT_60m_Datetime,
                        NIFTY_100_60m_TIMESTAMP,
                        NIFTY_100_60m_stock_name
                        -- NIFTY_100_60m_Datetime
                    )
                    FROM
                    ${ctx.ref(final_table)}
                    WHERE
                    ${target_cloumn} IS NOT NULL
                `;
        return query;
    });

    const tier1_model_info = constants.prefix + input_table_name + '_AUTOML_info_tier1_model' + constants.suffix
    const tier1_info_function = publish(tier1_model_info, {
        type: "table",
        tags: tags,
        dependencies: tier1_model
    }).query(ctx => {
        let query = ``
        query = `SELECT * FROM  
           ML.TRAINING_INFO(MODEL ${tier1_model_name})`
        return query;
    });

    const tier1_model_eval = constants.prefix + input_table_name + '_AUTOML_eval_tier1_model' + constants.suffix
    const tier1_eval_function = publish(tier1_model_eval, {
        type: "table",
        tags: tags,
        dependencies: tier1_model
    }).query(ctx => {
        let query = ``
        query = `SELECT * FROM  
           ML.EVALUATE(MODEL ${tier1_model_name})`
        return query;
    });

    // const tier1_model_feat_importance = constants.prefix + input_table_name + '_AUTOML_featimp_tier1_model' + constants.suffix
    // const tier1_model_feat_importance_function = publish(tier1_model_feat_importance, {
    //     type: "table",
    //     tags: tags,
    //     dependencies: tier1_model
    // }).query(ctx => {
    //     let query = ``
    //     query = `SELECT * FROM  
    //        ML.FEATURE_IMPORTANCE(MODEL ${tier1_model_name})`
    //     return query;
    // });

    // const featimp_tier1_table = constants.prefix + input_table_name + '_AUTOML_featimp_tier1_model_table' + constants.suffix;
    // const col_suffix = ``;
    // const tier1_importance_function = operate(featimp_tier1_table, {
    //     type: "operations",
    //     dependencies: tier1_model_feat_importance,
    // }).queries(ctx => {
    //     return utils.transpose_SAS(
    //         // data1 = `ML.FEATURE_IMPORTANCE(MODEL ${tier1_model_name})`,
    //         data1 = `${ctx.ref(tier1_model_feat_importance)}`,
    //         by1 = `${input_table_name}_TIMESTAMP,Target_Close`,
    //         id_trans1 = 'feature',
    //         var1 = 'importance_gain',
    //         suffix1 = col_suffix,
    //         out1 = `${constants.dtset}.`+featimp_tier1_table,
    //         input_final_table = `${ctx.ref(final_table)}`,
    //         extra_code1 = "where importance_gain > 0"
    //     );
    // });

    // const tier2_model_start = constants.prefix + input_table_name + '_AUTOML_tier2_model_input_view' + constants.suffix
    // const dummy_operationName = publish(tier2_model_start, {
    //     type: "view",
    //     dependencies: featimp_tier1_table,
    //     tags: tags
    // }).query(ctx => `SELECT * from ${constants.dtset}.${featimp_tier1_table}`);

    // const tier2_model = constants.prefix + input_table_name + '_AUTOML_train_tier2_model' + constants.suffix
    // const tier2_model_name = constants.dtset+'.'+constants.prefix + input_table_name + '_boosted_tree_regressor_tier2' + constants.suffix
    // const tier2_model_function = operate(tier2_model, {
    //     type: "table",
    //     tags: tags,
    //     dependencies: tier2_model_start
    // }).queries(ctx => {
    //     let query = ``
    //     query = `CREATE OR REPLACE MODEL
    //                 ${tier2_model_name}
    //                 OPTIONS(
    //                 model_type = 'automl_regressor',
    //                 input_label_cols = ['${target_cloumn}'],
    //                 budget_hours = 1.0                        -- Time in hours to train the model, adjust as needed
    //                 ) AS
    //                 SELECT
    //                 * EXCEPT(
    //                     ${input_table_name}_TIMESTAMP
    //                 )
    //                 FROM
    //                 ${ctx.ref(tier2_model_start)}
    //                 WHERE
    //                 ${target_cloumn} IS NOT NULL
    //             `;
    //     return query;
    // });

    // const tier2_model_info = constants.prefix + input_table_name + '_AUTOML_info_tier2_model' + constants.suffix
    // const tier2_info_function = publish(tier2_model_info, {
    //     type: "table",
    //     tags: tags,
    //     dependencies: tier2_model
    // }).query(ctx => {
    //     let query = ``
    //     query = `SELECT * FROM  
    //        ML.TRAINING_INFO(MODEL ${tier2_model_name})`
    //     return query;
    // });

    // const tier2_model_eval = constants.prefix + input_table_name + '_AUTOML_eval_tier2_model' + constants.suffix
    // const tier2_eval_function = publish(tier2_model_eval, {
    //     type: "table",
    //     tags: tags,
    //     dependencies: tier2_model
    // }).query(ctx => {
    //     let query = ``
    //     query = `SELECT * FROM  
    //        ML.EVALUATE(MODEL ${tier2_model_name})`
    //     return query;
    // });

    // const tier2_model_feat_importance = constants.prefix + input_table_name + '_AUTOML_featimp_tier2_model' + constants.suffix
    // const tier2_model_feat_importance_function = publish(tier2_model_feat_importance, {
    //     type: "table",
    //     tags: tags,
    //     dependencies: tier2_model
    // }).query(ctx => {
    //     let query = ``
    //     query = `SELECT * FROM  
    //        ML.FEATURE_IMPORTANCE(MODEL ${tier2_model_name})`
    //     return query;
    // });

    return tier1_model_eval;
};
