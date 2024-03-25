import json
import psycopg2
import logging
import polars as pl
from sqlalchemy import create_engine
from urllib.parse import quote_plus

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    filename="logs/py_log1.log",filemode="w",encoding="UTF-8")

def fetch_data_from_csv(csv_location):
    """
    Fetch data from a CSV file.
    
    Parameters:
    csv_location (str): The file path to the CSV file.

    Returns:
    pandas.DataFrame: DataFrame containing the data from the CSV file.

    """
    try:
        df = pl.scan_csv(csv_location
                         #with_column_names=lambda cols: [col.lower() for col in cols]
                        # truncate_ragged_lines=True,
                        #infer_schema_length=10000,  # Increase the infer_schema_length
                        # ignore_errors=True,         # Ignore parsing errors
                        # dtypes={'Location Description': str},  # Specify correct data type
                        # null_values=['Location Description']  # Handle null values
                        )
        logging.info(f"Data fetched successfully from {csv_location}")
        #df_d = df.collect()
        #logging.info(f"The number of rows in dataset {df_d.shape}")
        return df
    except Exception as e:
        logging.error(f"Error fetching data from CSV at {csv_location}: {e}")
        raise

def fetch_data_from_sql(user, password, host, port, database, schema, table):
    """
    Fetch data from a SQL database.

    Parameters:
    user (str): Username for connecting to the database.
    password (str): Password for connecting to the database.
    host (str): Hostname of the database server.
    port (str): Port number of the database server.
    database (str): Name of the database.
    schema (str): Name of the schema in the database.
    table (str): Name of the table from which data will be fetched.

    Returns:
    pandas.DataFrame: DataFrame containing the data from the specified SQL table.

    """
    try:
        connection_string = f"postgresql://{user}:{quote_plus(password)}@{host}:{port}/{database}"
        #engine = create_engine(connection_string)
        query = f"SELECT * FROM {schema}.{table}"
        
        df = pl.read_database_uri(query,connection_string)
        logging.info(f"Data fetched successfully from {schema}.{table} in the {database} database.")
        return df
    except Exception as e:
        logging.error(f"Error fetching data from SQL database {database}, table {schema}.{table}: {e}")
        raise

def store_data_to_csv(df, csv_location):
    """
    Store DataFrame to a CSV file.

    Parameters:
        df (pandas.DataFrame): DataFrame to be stored.
        csv_location (str): Filepath where CSV file will be saved.

    Raises:
        Exception: If an error occurs during the data storing process.
    """
    try:
        df = df.collect(streaming = True)
        df.write_csv(csv_location)
        logging.info(f"Data stored successfully to CSV at {csv_location}")
        logging.info(f"The number of rows in merged dataset {df.shape}")
    except Exception as e:
        logging.error(f"Error storing data to CSV at {csv_location}: {e}")
        raise

def store_data_to_db(df, user, password, host, port, database, schema, table):
    """
    Store DataFrame to a SQL database.

    Parameters:
        df (pandas.DataFrame): DataFrame to be stored.
        user (str): Username for database authentication.
        password (str): Password for database authentication.
        host (str): Hostname of the database server.
        port (str): Port number of the database server.
        database (str): Name of the database.
        schema (str): Name of the schema in the database.
        table (str): Name of the table to store data.

    Raises:
        Exception: If an error occurs during the data storing process.
    """
    try:
        connection_string = f"postgresql://{user}:{quote_plus(password)}@{host}:{port}/{database}"
        #engine1 = create_engine(connection_string)
        df.write_database(table, connection_string, if_table_exists="replace")
        logging.info(f"Data stored successfully to the {schema}.{table} table in the {database} database.")
    except Exception as e:
        logging.error(f"Error storing data to SQL database {database}, table {schema}.{table}: {e}")
        raise

def merge_operations(data_sources, operations):
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
            joined_df = joined_df.join(
                                table,
                                left_on=operation_details[i]['left_columns'],
                                right_on=operation_details[i]['right_columns'],
                                how=operation_details[i]['join_type'])
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
        with open("common.json", 'r') as file:
            data = json.load(file)

        data_sources = {}
        for source_name, source_details in data['sources'].items():
            if source_details['source_type'] == 'csv':
                data_sources[source_name] = fetch_data_from_csv(source_details['location'])
            elif source_details['source_type'] == 'database':
                data_sources[source_name] = fetch_data_from_sql(
                    source_details['user'],
                    source_details['password'],
                    source_details['host'],
                    source_details['port'],
                    source_details['database'],
                    source_details['schema'],
                    source_details['table_query']
                )
            else:
                raise Exception("Source Type not Compatible")
        for j,i in data_sources.items():
            logging.info(f"Data preview of source {j}:\n{i.head()}")


        joined_df = merge_operations(data_sources, data['operations'])

        if data['destination']['destination_type'] == 'csv':
            store_data_to_csv(joined_df, data['destination']['location'])
        elif data['destination']['destination_type'] == 'database':
            store_data_to_db(joined_df,
                             data['destination']['user'],
                             data['destination']['password'],
                             data['destination']['host'],
                             data['destination']['port'],
                             data['destination']['database'],
                             data['destination']['schema'],
                             data['destination']['table_query'])
    except Exception as e:
        logging.error(f"Failed to complete data processing: {e}")
    
    print("Program has ended.")

if __name__ == "__main__":
    main()