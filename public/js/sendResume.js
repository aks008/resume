async function sendMail() {
    // Get form   inputs
    const emailList = document.getElementById('emailList').value;
    const resumeFile = document.getElementById('resumeUpload').files[0];
    const googleAuthToken = document.getElementById('googleAuthToken').value;
    const authToken = document.getElementById('authToken').value;

    if (!emailList || !resumeFile || !googleAuthToken || !authToken) {
      alert("Please fill in all fields and upload a resume.");
      return;
    }

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('emailList', emailList);
      formData.append('attachments', resumeFile);
      formData.append('googleAuthToken', googleAuthToken);
      formData.append('authToken', authToken);

      // Axios POST request
      const response = await axios.post('http://localhost:8080/send-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle success response
      alert(`Mail sent successfully! Response: ${response.data.message}`);
    } catch (error) {
      // Handle error response
      console.error(error);
      alert(`Failed to send email. Error: ${error.response?.data?.message || error.message}`);
    }
  }