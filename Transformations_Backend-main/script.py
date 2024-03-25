import pandas as pd
import json
import logging
import fetch
import store 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    filename="logs/py_log.log",filemode="w")


def join_operations(data_sources, operations):
    """
    Perform operations on data from multiple sources and merge them into a single DataFrame.

    Parameters:
        data_sources (dict): Dictionary containing DataFrames fetched from different sources.
        operations (dict): Dictionary containing details of merge operations.

    Returns:
        pandas.DataFrame: Merged DataFrame.

    Raises:
        Exception: If an error occurs during the merge operation.
    """
    try:
        i = 0
        operation_details = list(operations.values())
        tablelist = list(data_sources.values())
        joined_df = tablelist[0]
        for table in tablelist[1:]:
            joined_df = pd.merge(joined_df,
                                 table,
                                 left_on=operation_details[i]['left_columns'],
                                 right_on=operation_details[i]['right_columns'],
                                 how=operation_details[i]['join_type'].lower())
            i += 1
            logging.info(f"Data preview after iteration {i}:\n{joined_df.head()}")
        logging.info("Merge operations completed successfully.")
        logging.info(f"Final Merged Data preview:\n{joined_df.head()}")
        logging.debug(f"{joined_df.head()}")
        return joined_df
    except Exception as e:
        logging.error(f"Cannot join the table: {e}")
        raise

def main():
    """
    Main function to orchestrate the data processing.
    """
    print("Program has started...")
    try:
        with open('common.json', 'r') as file:
            data = json.load(file)

        data_sources = {}
        for source_name, source_details in data['sources'].items():
            if source_details['source_type'] == 'csv':
                data_sources[source_name] = fetch.fetch_data_from_csv(source_details['location'])
            elif source_details['source_type'] == 'database':
                data_sources[source_name] = fetch.fetch_data_from_sql(
                    source_details['user'],
                    source_details['password'],
                    source_details['host'],
                    source_details['port'],
                    source_details['database'],
                    source_details['schema'],
                    source_details['table_query']
                )
            elif source_details['source_type'] == 'xml':
                data_sources[source_name] = fetch.fetch_data_from_xml(source_details['location'])
            elif source_details['source_type'] == 'excel':
                data_sources[source_name] = fetch.fetch_data_from_excel(source_details['location'])
            elif source_details['source_type'] == 'parquet':
                data_sources[source_name] = fetch.fetch_data_from_parquet(source_details['location'])
            elif source_details['source_type'] == 'json':
                data_sources[source_name] = fetch.fetch_data_from_json(source_details['location'])
            else:
                logging.error(f"Source Type not compatible")
                raise Exception("Source Type not compatible")

        for j,i in data_sources.items():
            logging.info(f"Data preview of source {j}:\n{i.head()}")
            logging.info(f"Memory usage of source {j}:\n{i.memory_usage().sum()}")


        joined_df = join_operations(data_sources, data['operations'])
        logging.info(f"Memory usage of merged df:\n{joined_df.memory_usage().sum()}")
        if data['destination']['destination_type'] == 'csv':
            store.store_data_to_csv(joined_df, data['destination']['location'])
        elif data['destination']['destination_type'] == 'database':
            store.store_data_to_db(joined_df,
                             data['destination']['user'],
                             data['destination']['password'],
                             data['destination']['host'],
                             data['destination']['port'],
                             data['destination']['database'],
                             data['destination']['schema'],
                             data['destination']['table_query'])
        elif data['destination']['destination_type'] == 'json':
            store.store_data_to_json(joined_df, data['destination']['location'])
        elif data['destination']['destination_type'] == 'xml':
            store.store_data_to_xml(joined_df, data['destination']['location'])
        elif data['destination']['destination_type'] == 'parquet':
            store.store_data_to_parquet(joined_df, data['destination']['location'])
        elif data['destination']['destination_type'] == 'excel':
            store.store_data_to_excel(joined_df, data['destination']['location'])
        else:
            logging.error(f"Source Type not compatible")
            raise Exception("Source Type not compatible")
        
    except Exception as e:
        logging.error(f"Failed to complete data processing: {e}")
    
    print("Program has ended.")

if __name__ == "__main__":
    main()