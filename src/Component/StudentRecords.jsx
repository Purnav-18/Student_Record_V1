import React, { useReducer } from 'react';
import './StudentRecords.css';

const initialState = {
  name: '',
  age: '',
  marks: ['', '', '', '', ''],
  records: [],
  editingIndex: null,
  percentage: '',
  division: '',
  error: '',
};

const subjects = ['Math', 'Science', 'English', 'History', 'Computer'];

function getDivision(percentage, marks) {
  const isFail = marks.some((m) => Number(m) < 33);
  if (isFail) return 'Failed';
  if (percentage >= 60) return 'First Division';
  if (percentage >= 50) return 'Second Division';
  return 'Third Division';
}

function isValidName(name) {
  return /^[a-zA-Z\s]+$/.test(name);
}

function isValidNumber(value) {
  return /^\d+$/.test(value);
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value, error: '' };
    case 'SET_MARK':
      const updatedMarks = [...state.marks];
      updatedMarks[action.index] = action.value;
      return { ...state, marks: updatedMarks, error: '' };
    case 'CALCULATE':
      const nums = state.marks.map(Number);
      const total = nums.reduce((a, b) => a + b, 0);
      const percentage = (total / 500 * 100).toFixed(1);
      const division = getDivision(percentage, nums);
      return { ...state, percentage, division };
    case 'SUBMIT':
      const record = {
        name: state.name,
        age: state.age,
        marks: [...state.marks],
        percentage: state.percentage,
        division: state.division,
      };
      const all = [...state.records];
      if (state.editingIndex !== null) {
        all[state.editingIndex] = record;
      } else {
        all.push(record);
      }
      return { ...initialState, records: all };
    case 'EDIT':
      const data = state.records[action.index];
      return {
        ...state,
        name: data.name,
        age: data.age,
        marks: [...data.marks],
        percentage: data.percentage,
        division: data.division,
        editingIndex: action.index,
      };
    case 'DELETE':
      const newRecords = state.records.filter((_, i) => i !== action.index);
      return { ...state, records: newRecords };
    case 'CLEAR':
      return { ...initialState, records: state.records };
    case 'SET_ERROR':
      return { ...state, error: action.message };
    default:
      return state;
  }
}

const StudentRecords = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidName(state.name)) {
      dispatch({ type: 'SET_ERROR', message: 'Name must have only letters.' });
      return;
    }
    if (!isValidNumber(state.age)) {
      dispatch({ type: 'SET_ERROR', message: 'Age must be a number.' });
      return;
    }
    for (let mark of state.marks) {
      if (!isValidNumber(mark)) {
        dispatch({ type: 'SET_ERROR', message: 'Marks must be numbers.' });
        return;
      }
    }
    dispatch({ type: 'CALCULATE' });
    setTimeout(() => {
      dispatch({ type: 'SUBMIT' });
    }, 100);
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h3>Enter Student Info</h3>

        <label>Name:</label>
        <input
          value={state.name}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })
          }
        />

        <label>Age:</label>
        <input
          value={state.age}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'age', value: e.target.value })
          }
        />

        {subjects.map((subject, index) => (
          <div key={index}>
            <label>{subject}:</label>
            <input
              value={state.marks[index]}
              onChange={(e) =>
                dispatch({ type: 'SET_MARK', index, value: e.target.value })
              }
            />
          </div>
        ))}

        <button className="submit-btn" type="submit">Submit</button>
        <button className="clear-btn" type="button" onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>

        {state.error && <div className="error">{state.error}</div>}
        {state.percentage && <div className="result green">{state.percentage}%</div>}
        {state.division && <div className="result green">{state.division}</div>}
      </form>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="record-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                {subjects.map((s, i) => <th key={i}>{s}</th>)}
                <th>%</th>
                <th>Division</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.records.map((rec, i) => (
                <tr key={i}>
                  <td>{rec.name}</td>
                  <td>{rec.age}</td>
                  {rec.marks.map((m, j) => <td key={j}>{m}</td>)}
                  <td>{rec.percentage}%</td>
                  <td>{rec.division}</td>
                  <td>
                    <div className="btn-group">
                      <button onClick={() => dispatch({ type: 'EDIT', index: i })}>Edit</button>
                      <button onClick={() => dispatch({ type: 'DELETE', index: i })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentRecords;
