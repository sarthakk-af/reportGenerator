import React from 'react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { createRg, getALLRg, UpdateRg, deleteRg } from '../actions/rgActions';
import axios from 'axios';


const Home = () => {
    const [data, setData] = useState({
        eventName: '',
        eventDate: '',
        eventVenue: '',
        eventDescription: '',
        eventPOC: '',
        id: ''
    });

    const [allRgs, setAllRgs] = useState([]);
    const [showData, setShowData] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const fetchRg = async () => {
        try {
            const res = await getALLRg();
            if (res && res.data) {
                setAllRgs(res.data);
                setShowData(true);
                console.log("Data fetched:", res.data);
            } else {
                console.log("Unexpected response structure:", res);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = event => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        if (!data.eventName || !data.eventDate || !data.eventVenue || !data.eventDescription) {
            alert('Please fill all required fields');
            return;
        }
        const body = {
            eventName: data.eventName,
            eventDate: data.eventDate,
            eventVenue: data.eventVenue,
            eventDescription: data.eventDescription,
            eventPOC: data.eventPOC
        };

        createRg(body).then((res) => {
            console.log('response', res);
            setData({
                eventName: '',
                eventDate: '',
                eventVenue: '',
                eventDescription: '',
                eventPOC: ''
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleValue = (element) => {
        setData({
            eventName: element.eventName,
            eventDate: element.eventDate,
            eventVenue: element.eventVenue,
            eventDescription: element.eventDescription,
            eventPOC: element.eventPOC,
            id: element._id
        });
        setSelectedData(element);
    };

    const handleUpdate = async () => {

        if (!data.eventName || !data.eventDate || !data.eventVenue || !data.eventDescription) {
            alert('Please fill all required fields');
            return;
        }
        const body = {
            eventName: data.eventName,
            eventDate: data.eventDate,
            eventVenue: data.eventVenue,
            eventDescription: data.eventDescription,
            eventPOC: data.eventPOC
        };

        const res = await UpdateRg(data.id, body);
        console.log('response', res);
        fetchRg();

        setData({
            eventName: '',
            eventDate: '',
            eventVenue: '',
            eventDescription: '',
            eventPOC: '',
            id: ''
        });

    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?'))

            if (!selectedData) {
                alert('No data selected to delete!');
                return;
            }

        try {
            const res = await deleteRg(selectedData._id);
            console.log('Deleted:', res);
            fetchRg(); // Refresh the data list after deletion
            setShowData(false); // Hide data if necessary
            setSelectedData(null); // Reset selected data after deletion
            setData({
                eventName: '',
                eventDate: '',
                eventVenue: '',
                eventDescription: '',
                eventPOC: '',
                id: ''
            });
            setSelectedData(null);
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("Failed to delete data. Please try again.");
        }
    };


    const handleClear = () => {
        setData({
            eventName: '',
            eventDate: '',
            eventVenue: '',
            eventDescription: '',
            eventPOC: '',
            id: ''
        });
        setShowData(false); // Hide fetched data
        setSelectedData(null); // Clear selected data
    };


    // const generateSummary = async (eventDescription) => {
    //     const apiKey = process.env.REACT_APP_OPENAI_API_KEY;  // Access your API key here
    //     //const prompt = `Summarize the following event: ${eventDescription}`;

    //     try {
    //         const response = await axios.post('https://api.openai.com/v1/completions', {
    //             model: 'text-davinci-003',
    //             prompt: prompt,
    //             max_tokens: 100,
    //             temperature: 0.7
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${apiKey}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         return response.data.choices[0].text.trim();
    //     } catch (error) {
    //         //console.error('Error generating summary:', error);
    //        // return 'Summary could not be generated.';
    //     }
    // };



    // Function to create PDF
    const createPDF = async (data) => {
        if (!data) {
            alert('No data selected to create report of!');
            return;
        }

        // Generate the summary
        // const summary = await generateSummary(data.eventDescription);

        const doc = new jsPDF();

        // Cover Page
        doc.setFillColor(230, 230, 250); // Light purple background
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

        // Add a cover image if available
        // const imgData = 'data:image/jpeg;base64,...'; // Replace with your image data
        // doc.addImage(imgData, 'JPEG', 10, 10, 190, 100); // Adjust positioning and size as needed

        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 150); // Dark Blue Color
        doc.text('Event Report', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

        doc.setFontSize(18);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(0, 102, 102); // Teal Color for subheadings
        doc.text(`Event Name: ${data.eventName}`, doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });
        doc.text(`Date: ${data.eventDate}`, doc.internal.pageSize.getWidth() / 2, 90, { align: 'center' });
        doc.text(`Venue: ${data.eventVenue}`, doc.internal.pageSize.getWidth() / 2, 100, { align: 'center' });

        // Adding a special note for corporate events
        if (data.eventType === 'Corporate') {
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 255);
            doc.text('Note: This report is generated for a corporate event.', 10, 120);
        }

        doc.addPage(); // Add new page for details

        // Header for Details Page
        doc.setFillColor(200, 200, 255); // Light blue background for header
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F');
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 150);
        doc.text('Event Details', 10, 15);

        doc.setLineWidth(0.5);
        doc.line(10, 22, 200, 22);

        // Table for Event Details
        const tableWidth = 180;
        const marginLeft = 10;
        const marginTop = 30;
        const rowHeight = 10;

        // Header Row
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 150);
        doc.setFillColor(220, 220, 220); // Light gray background for table header
        doc.rect(marginLeft, marginTop, tableWidth, rowHeight, 'F'); // Header background
        doc.setTextColor(0, 0, 0);
        doc.text('Event Information', marginLeft + 5, marginTop + 7);

        // Detail Rows
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const details = [
            { label: 'Event Name', value: data.eventName },
            { label: 'Event Date', value: data.eventDate },
            { label: 'Event Venue', value: data.eventVenue }
        ];

        details.forEach((detail, index) => {
            doc.rect(marginLeft, marginTop + (rowHeight * (index + 1)), tableWidth, rowHeight); // Draw row border
            doc.text(`${detail.label}:`, marginLeft + 5, marginTop + (rowHeight * (index + 1)) + 7);
            doc.text(detail.value, marginLeft + 80, marginTop + (rowHeight * (index + 1)) + 7);
        });

        // Description with bullet points
        doc.text('Event Description:', marginLeft, marginTop + (rowHeight * (details.length + 1)) + 10);
        const descriptionLines = doc.splitTextToSize(data.eventDescription, 180);
        descriptionLines.forEach((line, index) => {
            doc.text(`• ${line}`, marginLeft, marginTop + (rowHeight * (details.length + 1)) + 20 + index * 10);
        });

        // If the event is a large event, add a congratulatory note
        if (data.attendees && data.attendees.length > 100) {
            doc.setFontSize(14);
            doc.setTextColor(0, 100, 0);
            doc.text('Congratulations on organizing a successful large event!', marginLeft, marginTop + (rowHeight * (details.length + 1)) + 20 + descriptionLines.length * 10 + 10);
        }

        // Footer with page numbers
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Point of Contact: ${data.eventPOC}`, marginLeft, doc.internal.pageSize.getHeight() - 20);

        doc.setFontSize(10);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);

        doc.save(`${data.eventName}_report.pdf`);

        // Reset form data
        setData({
            eventName: '',
            eventDate: '',
            eventVenue: '',
            eventDescription: '',
            eventPOC: '',
            id: ''
        });
        setSelectedData(null);
    };

    const handleLogout = () => {
        alert('You have been logged out');
        window.location.href = '/';
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#4CAF50', fontFamily: 'Arial, sans-serif', marginBottom: '30px' }}>REPORT GENERATOR</h1>



            <div style={{ padding: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }} >

                <div style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
                    <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Name</label>
                    <input
                        type="text"
                        name="eventName"
                        value={data.eventName}
                        placeholder='Enter Name'
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
                    <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Date</label>
                    <input
                        type="text"
                        name="eventDate"
                        value={data.eventDate}
                        placeholder='Enter Date'
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
                    <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Venue</label>
                    <input
                        type="text"
                        name="eventVenue"
                        value={data.eventVenue}
                        placeholder='Enter Venue'
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '400px' }}>
                    <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Description</label>
                    <textarea
                        name="eventDescription"
                        value={data.eventDescription}
                        placeholder='Enter Description'
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s', height: '120px' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
                    <label style={{ marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>POC</label>
                    <input
                        type="text"
                        name="eventPOC"
                        value={data.eventPOC}
                        placeholder='Enter POC'
                        onChange={handleChange}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                    />
                </div>



            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
                <button
                    onClick={handleSubmit}
                    style={{ backgroundColor: '#4CAF50', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Submit
                </button>
                <button
                    onClick={fetchRg}
                    style={{ backgroundColor: '#2196F3', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Fetch
                </button>
                <button
                    onClick={handleUpdate}
                    style={{ backgroundColor: '#FFC107', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFB300'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFC107'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Update
                </button>
                <button
                    onClick={handleClear}
                    style={{ backgroundColor: '#f44336', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e53935'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Clear
                </button>
                <button
                    onClick={() => createPDF(selectedData)}
                    style={{ backgroundColor: '#009688', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00796B'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#009688'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Create Report
                </button>
                <button
                    onClick={handleDelete}
                    style={{ backgroundColor: '#800080', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6A1B9A'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#800080'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Delete
                </button>
                <button
                    onClick={handleLogout}
                    style={{ backgroundColor: '#000000', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: 'background-color 0.3s, transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e53935'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Logout
                </button>
            </div>

            {showData && (
                <div style={{ padding: '10px' }}>
                    {allRgs.map((element, i) => (
                        <div key={i} style={{ border: '1px solid #4CAF50', padding: '20px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'box-shadow 0.3s' }}
                            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                        >
                            <div onClick={() => handleValue(element)}>
                                <h2 style={{ color: '#4CAF50', margin: '0 0 10px' }}>{element.eventName}</h2>
                                <p>
                                    <b>Venue:</b> {element.eventVenue} &nbsp;&nbsp;
                                    <b>Date:</b> {element.eventDate} &nbsp;&nbsp;
                                    <b>Description:</b> {element.eventDescription} &nbsp;&nbsp;
                                    <b>POC:</b> {element.eventPOC}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
}

export default Home;