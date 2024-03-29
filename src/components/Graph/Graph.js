import React, { useState } from 'react';

import * as NeoVis from 'neovis.js';

import './graph.css';

import { Button, CircularProgress, TextField } from '@material-ui/core';

const CompletionEvent = 'completed';

function Graph() {

  const [loading, setLoading] = useState(false);
  const [nodesLimit, setNodesLimit] = useState(10);

  const handleLoadGraph = () => {
    document.getElementById('graph-container').innerHTML = '';
    setLoading(true);

    const config = {
      container_id: "graph-container",
      server_url: process.env.REACT_APP_NEO4J_URL,
      server_user: process.env.REACT_APP_NEO4J_USER,
      server_password: process.env.REACT_APP_NEO4J_PASSWORD,
      labels: {
        "Character": {
          "caption": "name",
          "size": "pagerank",
          "community": "community"
        }
      },
      relationships: {
        "INTERACTS": {
          "thickness": "weight",
          "caption": false
        }
      },
      initial_cypher: `MATCH (n)-[r:INTERACTS]->(m) RETURN n,r,m LIMIT ${nodesLimit}`
    };

    const graphContainer = new NeoVis.default(config);
    graphContainer.registerOnEvent(CompletionEvent, () => {
      setLoading(false);
    });
    graphContainer.render();
  };

  return (
    <>
      <aside className="button-bar">
        <Button variant="contained" onClick={handleLoadGraph}>Load graph (limit {nodesLimit})</Button>
        <TextField
          id="nodes-limit"
          label="Nodes limit"
          variant="outlined"
          type="number"
          value={nodesLimit}
          onInput={e => setNodesLimit(e.target.value)}
        />
      </aside>
      <div className="graph-and-loading-icon-wrapper">
        <div className="loading-icon-wrapper">
          {loading && <CircularProgress size={100} />}
        </div>
        <div id="graph-container"></div>
      </div>
    </>
  );
}

export default Graph;
