import './App.css';
import {useEffect, useState} from 'react';
import Papa from 'papaparse';

function App({ defaultCompanies, defaultScoreRecords }) {
  const [companies, setCompanies] = useState({ data: [] });
  const [scoreRecords, setScoreRecords] = useState({ data: [] });
  const [candidateId, setCandidateId] = useState('');
  const [newCandidate, setNewCandidate] = useState('');
  
  useEffect(() => {
    async function fetchCsv() {
      const scoreRecordsCsv = await fetch('/score-records.csv');
      const scoreRecordsText = await scoreRecordsCsv.text();
      const scoreRecordsData = Papa.parse(scoreRecordsText, { header: true });
      setScoreRecords(scoreRecordsData);
      // console.log(scoreRecordsData)
      const companiesCsv = await fetch('/companies.csv');
      const companiesText = await companiesCsv.text();
      const companiesData = Papa.parse(companiesText, { header: true });
      // console.log(companiesData)
      setCompanies(companiesData);

    };

    if (defaultCompanies) setCompanies(defaultCompanies);
    if (defaultScoreRecords) setScoreRecords(defaultScoreRecords);
    else fetchCsv();

  }, [setScoreRecords, setCompanies, defaultScoreRecords, defaultCompanies]);

  function getSimilarCompanies(companyId) {
    const company = companies.data.find(c => c.company_id === companyId) || {};
    return companies.data.filter(c => Math.abs(c.fractal_index - company.fractal_index) < 0.15).map(c => c.company_id);
  }

  function getPercentile(candidateId) {
    const candidate = scoreRecords.data.find(c => c.candidate_id === candidateId) || {};
    const sameTitleCandidates = scoreRecords.data.filter(c => c.title === candidate.title);
    const similarCompanyIds = getSimilarCompanies(candidate.company_id);
    // console.log("similarCompanyIds", similarCompanyIds)
    const similarCompanyCandidates = sameTitleCandidates.filter(c => similarCompanyIds.includes(c.company_id));
    const codeRank = similarCompanyCandidates.sort((a,b) => a.coding_score - b.coding_score);

    // console.log(codeRank)
    const codeIdx = codeRank.indexOf(candidate) + 1;
    const codePercentile = (codeIdx / codeRank.length) * 100;

    const communicationRank = similarCompanyCandidates.sort((a,b) => a.communication_score - b.communication_score);
    const communicationIdx = communicationRank.indexOf(candidate) + 1;
    const communicationPercentile = (communicationIdx / communicationRank.length) * 100;
    return [codePercentile, communicationPercentile];
  }

  const [codePercentile, communicationPercentile] = getPercentile(candidateId);

  return (
    <div className="App">
      <header className="App-header">
        <input type='text' data-testid='candidateId' value={candidateId} onChange={e => setCandidateId(e.target.value)} />
        <p data-testid='codingPercentile'>
          Coding Percentile:{' '}
          {
            codePercentile > 0 ? codePercentile.toFixed(2) + '%' : 'Type A Valid Candidate ID'
          }
        </p>
        <p>
          Communication Percentile:{' '} 
          {
            communicationPercentile > 0 ? communicationPercentile.toFixed(2) + '%' : 'Type A Valid Candidate ID'
          }
        </p>
        <input type='text' placeholder='Candidate ID' value={newCandidate.candidate_id} onChange={e => setNewCandidate({ ...newCandidate, candidate_id: e.target.value })} />
        <input type='text' placeholder='Communication Score' value={newCandidate.communication_score} onChange={e => setNewCandidate({ ...newCandidate, communication_score: e.target.value })} />
        <input type='text' placeholder='Coding Score' value={newCandidate.coding_score} onChange={e => setNewCandidate({ ...newCandidate, coding_score: e.target.value })} />
        <input type='text' placeholder='Title' value={newCandidate.title} onChange={e => setNewCandidate({ ...newCandidate, title: e.target.value })} />
        <input type='text' placeholder='Company ID' value={newCandidate.company_id} onChange={e => setNewCandidate({ ...newCandidate, company_id: e.target.value })} />
        <button onClick={() => {
          setScoreRecords({ ...scoreRecords, data: [ ...scoreRecords.data, newCandidate ]});
        }}>Add New Candidate</button>
      </header>
    </div>
  );
}

export default App;
