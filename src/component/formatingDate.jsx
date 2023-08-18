import '../App.css'

function formatDate(dateTimeString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleDateString('en-US', options);
  }

export default formatDate
