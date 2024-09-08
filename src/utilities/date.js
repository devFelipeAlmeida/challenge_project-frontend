export const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).replace(/ /g, ' ');
}