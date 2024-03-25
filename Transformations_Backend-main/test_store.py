import psycopg2
import pytest
import pandas as pd
import logging
from pathlib import Path
from store import store_data_to_csv,store_data_to_db, store_data_to_json, store_data_to_xml, store_data_to_parquet, store_data_to_excel

@pytest.fixture
def sample_data():
    data = {'A': [1, 2, 3], 'B': [4, 5, 6]}
    return pd.DataFrame(data)

@pytest.fixture
def csv_location(tmp_path):
    return tmp_path / 'test.csv'

def test_store_data_to_csv(sample_data, csv_location):
    store_data_to_csv(sample_data, csv_location)
    assert Path(csv_location).is_file()
    
    data_from_csv = pd.read_csv(csv_location)
    # Check if the contents of the data frame are the same as the original sample_data
    pd.testing.assert_frame_equal(sample_data, data_from_csv)

def test_store_data_to_csv_exception(sample_data, csv_location, caplog):
    with pytest.raises(Exception):
        store_data_to_csv(sample_data, "/invalid/path/test.csv")
    assert "Error storing data to CSV" in caplog.text


@pytest.fixture
def sample_data():
    data = {'A': [1, 2, 3], 'B': [4, 5, 6]}
    return pd.DataFrame(data)

@pytest.mark.parametrize(
    "user, password, host, port, database, schema, table, expect_error",
    [
        ('pab123', 'pab123', 'localhost', 5432, 'postgres', 'public', 'demo', False),
        ('invalid_user', 'test_password', 'test_host', 'test_port', 'test_database', 'test_schema', 'test_table', True),
        ('test_user', 'invalid_password', 'test_host', 'test_port', 'test_database', 'test_schema', 'test_table', True),
        ('test_user', 'test_password', 'invalid_host', 'test_port', 'test_database', 'test_schema', 'test_table', True),
        ('test_user', 'test_password', 'test_host', 'invalid_port', 'test_database', 'test_schema', 'test_table', True),
        ('test_user', 'test_password', 'test_host', 'test_port', 'invalid_database', 'test_schema', 'test_table', True),
        ('test_user', 'test_password', 'test_host', 'test_port', 'test_database', 'invalid_schema', 'test_table', True),
        ('test_user', 'test_password', 'test_host', 'test_port', 'test_database', 'test_schema', 'invalid_table', True),
    ]
)
def test_store_data_to_db(sample_data, user, password, host, port, database, schema, table, expect_error):
    if expect_error:
        with pytest.raises(Exception):
            store_data_to_db(sample_data, user, password, host, port, database, schema, table)
    else:
        store_data_to_db(sample_data, user, password, host, port, database, schema, table)

        # Connect to the database
        conn = psycopg2.connect(
            user=user,
            password=password,
            host=host,
            port=port,
            database=database
        )
        cur = conn.cursor()

        # Query the database to fetch the data
        cur.execute(f"SELECT * FROM {schema}.{table}")
        result = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        result_df = pd.DataFrame(result, columns=columns)

        # Close the cursor and connection
        cur.close()
        conn.close()

        # Assert that the data added to the database matches the original data frame
        pd.testing.assert_frame_equal(sample_data, result_df)


def test_store_data_to_json(sample_data, tmp_path):
    json_location = tmp_path / 'test.json'
    store_data_to_json(sample_data, json_location)
    assert json_location.exists()
    
    data_from_json = pd.read_json(json_location)
    # Check if the contents of the data frame are the same as the original sample_data
    pd.testing.assert_frame_equal(sample_data, data_from_json)

def test_store_data_to_xml(sample_data, tmp_path):
    xml_location = tmp_path / 'test.xml'
    store_data_to_xml(sample_data, xml_location)
    assert xml_location.exists()
    
    data_from_xml = pd.read_xml(xml_location)
    pd.testing.assert_frame_equal(sample_data,data_from_xml)

def test_store_data_to_parquet(sample_data, tmp_path):
    parquet_location = tmp_path / 'test.parquet'
    store_data_to_parquet(sample_data, parquet_location)
    assert parquet_location.exists()
    data_from_parquet = pd.read_parquet(parquet_location)
    pd.testing.assert_frame_equal(sample_data,data_from_parquet)

def test_store_data_to_excel(sample_data, tmp_path):
    excel_location = tmp_path / 'test.xlsx'
    store_data_to_excel(sample_data, excel_location)
    assert excel_location.exists()
    data_from_excel = pd.read_excel(excel_location)
    pd.testing.assert_frame_equal(sample_data,data_from_excel)
