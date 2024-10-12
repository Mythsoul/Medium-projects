import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'world',
  password: '123456',
  port: 5432,
});

db.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM visited_countries');
    const country_codes = result.rows.map(country => country.country_code);
    const country_name = result.rows.map(country => country.country_name);
    const error = req.query.error;
    res.render('index.ejs', { total: country_codes.length, error, country: country_codes, country_name });
  } catch (err) {
    console.log('Error while loading ', err.stack);
    res.render('index.ejs', { total: 0, error: 'Got an error' });
  }
});

app.post('/add', async (req, res) => {
  try {
    const countryName = req.body.country.trim().toLowerCase();
    console.log('Received country name:', countryName);

    const availableCountries = await db.query('SELECT country_name FROM countries');
    const validCountries = availableCountries.rows.map(row => row.country_name.trim().toLowerCase());

    if (!validCountries.includes(countryName)) {
      console.log('Invalid country:', countryName);
      res.redirect('/?error=Invalid+country');
      return;
    }

    const codeResult = await db.query('SELECT country_code FROM countries WHERE lower(trim(country_name)) = $1', [countryName]);
    const countryCode = codeResult.rows[0]?.country_code;

    if (!countryCode) {
      console.log('Country code not found for:', countryName);
      res.redirect('/');
      return;
    }

    const visitedCountries = await db.query('SELECT country_code FROM visited_countries');
    const visitedCountryCodes = visitedCountries.rows.map(row => row.country_code);

    if (visitedCountryCodes.includes(countryCode)) {
      console.log('Country already visited:', countryName);
      res.redirect('/?error=Country+already+visited');
      return;
    }

    await db.query('INSERT INTO visited_countries(country_code, country_name) VALUES($1, $2)', [countryCode, countryName]);
    res.redirect('/');
  } catch (err) {
    console.log('Error found while adding country:', err.message);
    res.redirect('/');
  }
});

app.post('/new', (req, res) => {
  const user = req.body.name;
  const color = req.body.color;
  console.log('User:', user, 'and Color:', color);
  res.render('new.ejs');
});

app.get('/edit/:id', (req, res) => {
  const countryId = req.params.id;
  res.render('edit.ejs', { country: countryId });
});

app.post('/edit/:id', async (req, res) => {
  const countryname = req.params.id;
  const getcountryid = await db.query("select id from visited_countries where country_name = $1" , [countryname]); 
  const countryId = getcountryid.rows[0]?.id
  const newCountryName = req.body.country_name.trim().toLowerCase();

  try {
    console.log('Received country name:', newCountryName);

    const availableCountries = await db.query('SELECT country_name FROM countries');
    const validCountries = availableCountries.rows.map(row => row.country_name.trim().toLowerCase());

    if (!validCountries.includes(newCountryName)) {
      console.log('Invalid country:', newCountryName);
      res.redirect('/?error=Invalid+country');
      return;
    }

    const codeResult = await db.query('SELECT country_code FROM countries WHERE lower(trim(country_name)) = $1', [newCountryName]);
    const newCountryCode = codeResult.rows[0]?.country_code;

    if (!newCountryCode) {
      console.log('Country code not found for:', newCountryName);
      res.redirect('/');
      return;
    }

    const visitedCountries = await db.query('SELECT country_code FROM visited_countries WHERE id != $1', [countryId]);
    const visitedCountryCodes = visitedCountries.rows.map(row => row.country_code);

    if (visitedCountryCodes.includes(newCountryCode)) {
      console.log('Country already visited:', newCountryName);
      res.redirect('/?error=Country+already+visited');
      return;
    }

    await db.query('UPDATE visited_countries SET country_code = $1, country_name = $2 WHERE id = $3', [newCountryCode, newCountryName, countryId]);
    res.redirect('/');
  } catch (err) {
    console.log('Error found while updating country:', err.message);
    res.redirect('/');
  }
});

app.get('/delete/:id', async (req, res) => {
  const country_name = req.params.id;
  const getcountryid = await db.query("select id from visited_countries where country_name = $1" , [country_name]); 
  const id = getcountryid.rows[0]?.id; 
  try {
    await db.query('DELETE FROM visited_countries WHERE id = $1', [id]);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
