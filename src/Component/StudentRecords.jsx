import React, { useReducer } from 'react';
import './StudentRecords.css';

const subjects = ['Math', 'Science', 'English', 'History', 'Computer'];

const initialState = {
  name: '',
  age: '',
  marks: ['', '', '', '', ''],
  records: [],
  editingIndex: null,
  percentage: '',
  division: '',
  errors: {
    name: '',
    age: '',
    marks: ['', '', '', '', ''],
  },
};

function validateName(name) {
  return /^[A-Za-z ]+$/.test(name);
}

function validateAge(age) {
  return /^\d+$/.test(age);
}

function validateMark(value) {
  const num = Number(value);
  return /^\d+$/.test(value) && num >= 0 && num <= 100;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]:
            action.field === 'name' && !validateName(action.value)
              ? 'Enter only letters'
              : action.field === 'age' && !validateAge(action.value)
              ? 'Enter valid age'
              : '',
        },
      };
    case 'SET_MARK':
      const newMarks = [...state.marks];
      const markErrors = [...state.errors.marks];
      newMarks[action.index] = action.value;
      markErrors[action.index] = !validateMark(action.value) ? '0-100 only' : '';
      return {
        ...state,
        marks: newMarks,
        errors: {
          ...state.errors,
          marks: markErrors,
        },
      };
    case 'CALCULATE':
      const nums = state.marks.map(Number);
      const total = nums.reduce((a, b) => a + b, 0);
      const percentage = (total / 500 * 100).toFixed(1);
      const isFailed = nums.some((m) => m < 33);
      const division = isFailed
        ? 'Failed'
        : percentage >= 60
        ? 'First Division'
        : percentage >= 50
        ? 'Second Division'
        : 'Third Division';
      return { ...state, percentage, division };
    case 'SUBMIT':
      const newRecord = {
        name: state.name,
        age: state.age,
        marks: [...state.marks],
        percentage: state.percentage,
        division: state.division,
      };
      const updated = [...state.records];
      if (state.editingIndex !== null) {
        updated[state.editingIndex] = newRecord;
      } else {
        updated.push(newRecord);
      }
      return { ...initialState, records: updated };
    case 'EDIT':
      const edit = state.records[action.index];
      return {
        ...state,
        name: edit.name,
        age: edit.age,
        marks: [...edit.marks],
        percentage: edit.percentage,
        division: edit.division,
        editingIndex: action.index,
        errors: initialState.errors,
      };
    case 'DELETE':
      const remaining = state.records.filter((_, i) => i !== action.index);
      return { ...state, records: remaining };
    case 'CLEAR':
      return { ...initialState, records: state.records };
    default:
      return state;
  }
}

const StudentRecords = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hasErrors = () => {
    return (
      state.errors.name ||
      state.errors.age ||
      state.errors.marks.some((e) => e) ||
      state.name.trim() === '' ||
      state.age.trim() === '' ||
      state.marks.some((m) => m === '')
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasErrors()) {
      dispatch({ type: 'CALCULATE' });
      setTimeout(() => dispatch({ type: 'SUBMIT' }), 100);
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h3>Student Form</h3>

        <label>Name:</label>
        <input
          value={state.name}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
          placeholder="Enter name"
        />
        {state.errors.name && <div className="error">{state.errors.name}</div>}

        <label>Age:</label>
        <input
          value={state.age}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'age', value: e.target.value })}
          placeholder="Enter age"
        />
        {state.errors.age && <div className="error">{state.errors.age}</div>}

        {subjects.map((sub, i) => (
          <div key={i}>
            <label>{sub}:</label>
            <input
              value={state.marks[i]}
              onChange={(e) => dispatch({ type: 'SET_MARK', index: i, value: e.target.value })}
              placeholder={`Enter ${sub} marks`}
            />
            {state.errors.marks[i] && <div className="error">{state.errors.marks[i]}</div>}
          </div>
        ))}

        <button className="submit-btn" type="submit">Submit</button>
        <button className="clear-btn" type="button" onClick={() => dispatch({ type: 'CLEAR' })}>
          Clear
        </button>

        {state.percentage && <div className="result green">{state.percentage}%</div>}
        {state.division && <div className="result green">{state.division}</div>}
      </form>

      <div className="table-container">
        <div className="table-scroll">
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
                  <td>{rec.percentage}</td>
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
