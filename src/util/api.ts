type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';


export async function axios(method : HttpMethod, url : string, body : unknown) {
  
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return  data ;
  } catch (error) {
    console.error('API 요청 오류:', error);
  }
}