import pandas as pd
import json
import psycopg2
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    filename="D:/project/questkart_task/questkart_mini_project/Transformations_Backend-main/logs/py_log.log",
    filemode="w",
)

# csv
# sql
# xml
# excel
# parquet
# json


def fetch_data_from_csv(csv_location):
    """
    Fetch data from a CSV file.

    Parameters:
    csv_location (str): The file path to the CSV file.

    Returns:
    pandas.DataFrame: DataFrame containing the data from the CSV file.

    """
    try:
        chunks = []

        # Iterate over the file in chunks
        for chunk in pd.read_csv(
            csv_location, chunksize=10000, dtype_backend="pyarrow"
        ):
            # Process the chunk (e.g., data cleaning, analysis)
            chunks.append(chunk)

        # Concatenate all chunks into a single DataFrame
        df = pd.concat(chunks, ignore_index=True)
        logging.info(f"Data fetched successfully from {csv_location}")
        return df
        """
        return df
        df = pd.read_csv(csv_location)
        
        """
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
        connection_string = f"postgresql://{user}:{password}@{host}:{port}/{database}"
        query = f"SELECT * FROM {schema}.{table}"
        df = pd.read_sql(query, connection_string, dtype_backend="pyarrow")
        logging.info(
            f"Data fetched successfully from {schema}.{table} in the {database} database."
        )
        return df
    except Exception as e:
        logging.error(
            f"Error fetching data from SQL database {database}, table {schema}.{table}: {e}"
        )
        raise


def fetch_data_from_xml(xml_location):
    """
    Fetch data from an XML file.

    Parameters:
    xml_location (str): The file path to the XML file.

    Returns:
    pandas.DataFrame: DataFrame containing the data from the XML file.
    """
    try:
        df = pd.read_xml(xml_location, dtype_backend="pyarrow")
        logging.info(f"Data fetched successfully from {xml_location}")
        return df
    except Exception as e:
        logging.error(f"Error fetching data from XML at {xml_location}: {e}")
        raise


def fetch_data_from_excel(excel_location):
    """
    Fetch data from an Excel file.

    Parameters:
    excel_location (str): The file path to the Excel file.

    Returns:
    pandas.DataFrame: DataFrame containing the data from the Excel file.
    """
    try:
        df = pd.read_excel(excel_location, dtype_backend="pyarrow")
        logging.info(f"Data fetched successfully from {excel_location}")
        return df
    except Exception as e:
        logging.error(f"Error fetching data from Excel at {excel_location}: {e}")
        raise


def fetch_data_from_parquet(parquet_location):
    """
    Fetch data from a Parquet file.

    Parameters:
    parquet_location (str): The file path to the Parquet file.

    Returns:
    pandas.DataFrame: DataFrame containing the data from the Parquet file.
    """
    try:
        df = pd.read_parquet(parquet_location, dtype_backend="pyarrow")
        logging.info(f"Data fetched successfully from {parquet_location}")
        return df
    except Exception as e:
        logging.error(f"Error fetching data from Parquet at {parquet_location}: {e}")
        raise


def fetch_data_from_json(json_location):
    """
    Fetch data from a JSON file.

    Parameters:
    json_location (str): The file path to the JSON file.

    Returns:
    pandas.DataFrame: DataFrame containing the data from the JSON file.
    """
    try:
        df = pd.read_json(json_location, dtype_backend="pyarrow")
        logging.info(f"Data fetched successfully from {json_location}")
        return df
    except Exception as e:
        logging.error(f"Error fetching data from JSON at {json_location}: {e}")
        raise
