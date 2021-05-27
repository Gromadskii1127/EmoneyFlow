const buildAuthorization = user => {
  return `Token ${user?.token}`;
}; 

export default buildAuthorization;
