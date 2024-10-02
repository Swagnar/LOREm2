import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import Navbar from './navbar/Navbar';

// @ts-ignore
import initSqlJs, { SqlJsStatic, Database } from 'sql.js';

import './App.css';

interface QueryExecResult {
  columns: string[];
  values: (string | number)[][];
}

interface ResultsTableProps {
  columns: string[];
  values: (string | number)[][];
}

function ResultsTable({ columns, values }: ResultsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((columnName: string, i: React.Key) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((row, i) => (
          <tr key={i}>
            {row.map((value, j) => (
              <td key={j}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface SQLReplProps {
  db: Database | null;
}

function SQLRepl({ db }: SQLReplProps) {
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QueryExecResult[]>([]);

  const exec = (sql: string) => {
    try {
      if (db) {
        const queryResults = db.exec(sql) as QueryExecResult[];
        setResults(queryResults);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResults([]);
    }
  };

  return (
    <div className="App">
      <h1>React SQL Interpreter</h1>
      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder='Try "select sqlite_version()"'
      ></textarea>
      <pre className="error">{error ?? ""}</pre>
      <pre>
        {results.map(({ columns, values }, i) => (
          <ResultsTable key={i} columns={columns} values={values} />
        ))}
      </pre>
    </div>
  );
}

export default function App() {
  const [_db, setDb] = useState<Database | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function initDatabase() {
      console.log("%cInit database...", "color: red;");
      try {
        const sqlPromise: Promise<SqlJsStatic> = await initSqlJs({
// @ts-ignore
          locateFile: file => `https://sql.js.org/dist/${file}`
        });

        console.log("%cFetching the database...", "color: orange;");
        const dataPromise = fetch("/db.sqlite").then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.arrayBuffer();
        });

        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        setDb(new SQL.Database(new Uint8Array(buf)));

      } catch (err: any) {
        setError(err.message || "Failed to initialize the database");
        console.error("%cDatabase initialization failed:", "font-weight:bold", err);
      }
    }

    initDatabase();
  }, []);

  const handleSplashEnd = () => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  };

  return (
    <>
      {_error ? (
        <pre>Some error: {JSON.stringify(_error)}</pre>
      ) : !_db ? (
        <pre>Loading REPL...</pre>
      ) : (
        <SQLRepl db={_db} />
      )}

      {showSplash ? (
        <SplashScreen onAnimationEnd={handleSplashEnd} />
      ) : (
        <Navbar />
      )}
    </>
  );
}
