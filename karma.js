function startup(db) {
  return new Promise((resolve, reject) => {
    db.run("CREATE TABLE if not exists karma (name TEXT PRIMARY KEY, score INTEGER)", (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function getKarma(db, name) {
  return new Promise((resolve, reject) => {
    db.get("SELECT score FROM karma WHERE name = ?", name, (err, row) => {
      if (err) reject(err);
      if (row && row.score) resolve(row.score);
      resolve(0);
    });
  });
}

function setKarma(db, name, increaseBy) {
  return new Promise((resolve, reject) => {
    
    getKarma(db, name).then((score) => {
      var newScore = score + increaseBy;
      return new Promise((resolve, reject) => {
        db.run("INSERT OR REPLACE INTO karma (name, score) VALUES (?,?)", [name, newScore], (err, row) => {
          if (err) reject(err);
          resolve(newScore);
        });
      });
    }).then((newScore) => {
      resolve(newScore);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getLeaderboard(db, sortOrder) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name, score FROM karma ORDER BY SCORE ${sortOrder} LIMIT 10`, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

function nuclearBomb(db) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM karma; VACUUM", (err, row) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function close(db) {
  return new Promise((resolve, reject) => {
    db.close((err, row) => {
      if (err) reject(err);
      resolve();
    });
  });
}

module.exports = {
  startup, getKarma, setKarma, getLeaderboard, nuclearBomb, close
};