import pandas as pd
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    filename="logs/py_log.log",filemode="w")

# csv
# db
# json
# xml
# parquet
# excel

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
        df.to_csv(csv_location,index=False)
        logging.info(f"Data stored successfully to CSV at {csv_location}")
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
        connection_string = f"postgresql://{user}:{password}@{host}:{port}/{database}"
        df.to_sql(table, connection_string, schema=schema, if_exists="replace", index=False)
        logging.info(f"Data stored successfully to the {schema}.{table} table in the {database} database.")
    except Exception as e:
        logging.error(f"Error storing data to SQL database {database}, table {schema}.{table}: {e}")
        raise

def store_data_to_json(df, json_location):
    """
    Store data to a JSON file.

    Parameters:
        data: Data to be stored.
        json_location (str): Filepath where JSON file will be saved.

    Raises:
        Exception: If an error occurs during the data storing process.
    """
    try:
        df.to_json(json_location,index=False)
        logging.info(f"Data stored successfully to JSON at {json_location}")
    except Exception as e:
        logging.error(f"Error storing data to JSON at {json_location}: {e}")
        raise

# Function to store data to XML
def store_data_to_xml(df, xml_location):
    """
    Store DataFrame to an XML file.

    Parameters:
        df (pandas.DataFrame): DataFrame to be stored.
        xml_location (str): Filepath where XML file will be saved.

    Raises:
        Exception: If an error occurs during the data storing process.
    """
    try:
        df.to_xml(xml_location, index=False)
        logging.info(f"Data stored successfully to XML at {xml_location}")
    except Exception as e:
        logging.error(f"Error storing data to XML at {xml_location}: {e}")
        raise

# Function to store data to Parquet
def store_data_to_parquet(df, parquet_location):
    """
    Store DataFrame to a Parquet file.

    Parameters:
        df (pandas.DataFrame): DataFrame to be stored.
        parquet_location (str): Filepath where Parquet file will be saved.

    Raises:
        Exception: If an error occurs during the data storing process.
    """
    try:
        df.to_parquet(parquet_location, index=False)
        logging.info(f"Data stored successfully to Parquet at {parquet_location}")
    except Exception as e:
        logging.error(f"Error storing data to Parquet at {parquet_location}: {e}")
        raise

# Function to store data to Excel
def store_data_to_excel(df, excel_location):
    """
    Store DataFrame to an Excel file.

    Parameters:
        df (pandas.DataFrame): DataFrame to be stored.
        excel_location (str): Filepath where Excel file will be saved.

    Raises:
        Exception: If an error occurs during the data storing process.
    """
    try:
        df.to_excel(excel_location, index=False)
        logging.info(f"Data stored successfully to Excel at {excel_location}")
    except Exception as e:
        logging.error(f"Error storing data to Excel at {excel_location}: {e}")
        raise