import pandas as pd
import pytest
import json
import tempfile
import os
from pathlib import Path
from unittest.mock import patch, Mock
import pyarrow.parquet as pq
from openpyxl import Workbook
from fetch import fetch_data_from_csv, fetch_data_from_sql ,fetch_data_from_xml,fetch_data_from_excel,fetch_data_from_parquet,fetch_data_from_json


# csv 11-31
# sql 33-74
# xml 78-98
# excel 102-137
# parquet 139-

@pytest.mark.parametrize("csv_location", [("data/employees.csv"),("data/departments.csv"),("data/products.csv")])
def test_fetch_data_from_csv_parametrize(csv_location):
    """
    Test for fetch_data_from_csv function.
    """
    data = fetch_data_from_csv(csv_location)
    assert data is not None
    assert isinstance(data, pd.DataFrame)

@pytest.fixture
def csv_location(tmp_path):
    csv_file = tmp_path / 'test.csv'
    data = {'A': [1, 2, 3], 'B': [4, 5, 6]}
    df = pd.DataFrame(data)
    df.to_csv(csv_file, index=False)
    return csv_file

def test_fetch_data_from_csv_fixture(csv_location):
    df = fetch_data_from_csv(csv_location)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 3

@pytest.mark.parametrize(
    "user, password, host, port, database, schema, table",
    [
        ("wrong_user", "wrong_password", "localhost", "5432", "postgres", "public", "projects"),
        ("pab123", "pab123", "wrong_host", "5432", "postgres", "public", "projects"),
        ("pab123", "pab123", "localhost", "wrong_port", "postgres", "public", "projects"),
        ("pab123", "pab123", "localhost", "5432", "wrong_database", "public", "projects"),
        ("pab123", "pab123", "localhost", "5432", "postgres", "wrong_schema", "projects"),
        ("pab123", "pab123", "localhost", "5432", "postgres", "public", "wrong_table"),
    ]
)
@patch("fetch.fetch_data_from_sql")
def test_fetch_data_from_sql_parametrize(mock_read_sql, user, password, host, port, database, schema, table):
    mock_read_sql.return_value = pd.DataFrame()
    with pytest.raises(Exception):
        fetch_data_from_sql(user, password, host, port, database, schema, table)

@pytest.fixture
def mock_read_sql():
    with patch('fetch.pd.read_sql') as mock_read_sql:
        yield mock_read_sql

def test_fetch_data_from_sql_fixture(mock_read_sql):
    user = "pab123"
    password = "pab123"
    host = "localhost"
    port = "5432"
    database = "postgres"
    schema = "public"
    table = "demo"

    # Mocking the return value of pd.read_sql
    mock_df = pd.DataFrame({'col1': [1, 2, 3], 'col2': ['A', 'B', 'C']})
    mock_read_sql.return_value = mock_df

    # Calling the function to be tested
    result_df = fetch_data_from_sql(user, password, host, port, database, schema, table)

    # Assertions
    mock_read_sql.assert_called_once_with(f"SELECT * FROM {schema}.{table}", f"postgresql://{user}:{password}@{host}:{port}/{database}")
    assert result_df.equals(mock_df)

# , ("data/departments.xml")
@pytest.mark.parametrize("xml_location", [("data/employees.xml")])
def test_fetch_data_from_xml_parametrize(xml_location):
    """
    Test for fetch_data_from_xml function.
    """
    data = fetch_data_from_xml(xml_location)
    assert data is not None
    assert isinstance(data, pd.DataFrame)

@pytest.fixture
def xml_location(tmp_path):
    xml_file = tmp_path / 'test.xml'
    data = '<?xml version="1.0" encoding="UTF-8"?><root><row><A>1</A><B>4</B></row><row><A>2</A><B>5</B></row><row><A>3</A><B>6</B></row></root>'
    with open(xml_file, 'w') as f:
        f.write(data)
    return xml_file

def test_fetch_data_from_xml_fixture(xml_location):
    df = fetch_data_from_xml(xml_location)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 3




@pytest.fixture
def excel_location(tmp_path):
    excel_file = tmp_path / 'test.xlsx'
    wb = Workbook()
    ws = wb.active
    ws.append(['A', 'B'])
    for i in range(1, 4):
        ws.append([i, i + 3])
    wb.save(excel_file)
    return excel_file

# , ("data/departments.xlsx"), ("data/products.xlsx")

@pytest.mark.parametrize("excel_location", [("data/employees.xlsx")])
def test_fetch_data_from_excel_parametrize(excel_location):
    """
    Test for fetch_data_from_excel function.
    """
    data = fetch_data_from_excel(excel_location)
    assert data is not None
    assert isinstance(data, pd.DataFrame)

def test_fetch_data_from_excel_fixture(excel_location):
    """
    Test for fetch_data_from_excel function using a fixture.
    """
    df = fetch_data_from_excel(excel_location)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 3

# , ("data/departments.parquet"), ("data/products.parquet")

@pytest.mark.parametrize("file_location", [("data/employees.parquet")])
def test_fetch_data_from_parquet_parametrize(file_location):
    """
    Test for fetch_data_from_parquet function.
    """
    data = fetch_data_from_parquet(file_location)
    assert data is not None
    assert isinstance(data, pd.DataFrame)

@pytest.fixture
def parquet_location(tmp_path):
    parquet_file = tmp_path / 'test.parquet'
    data = {'A': [1, 2, 3], 'B': [4, 5, 6]}
    df = pd.DataFrame(data)
    df.to_parquet(parquet_file, index=False)
    return parquet_file

def test_fetch_data_from_parquet_fixture(parquet_location):
    df = fetch_data_from_parquet(parquet_location)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 3

# ,("data/departments.json"),("data/products.json")
@pytest.mark.parametrize("json_location", [("data/employees.json")])
def test_fetch_data_from_json_parametrize(json_location):
    """
    Test for fetch_data_from_json function.
    """
    data = fetch_data_from_json(json_location)
    assert data is not None
    assert isinstance(data, pd.DataFrame)

@pytest.fixture
def json_location(tmp_path):
    json_file = tmp_path / 'test.json'
    data = {'A': [1, 2, 3], 'B': [4, 5, 6]}
    with open(json_file, 'w') as f:
        json.dump(data, f)
    return json_file

def test_fetch_data_from_json_fixture(json_location):
    df = fetch_data_from_json(json_location)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 3



