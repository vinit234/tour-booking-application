import React, { useState, useContext, useEffect } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const Booking = ({ tour, avgRating }) => {
  const { price, reviews = [], title, hotelOptions = {}, flightOptions = {} } = tour;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState({
    userId: user?._id || '',
    userEmail: user?.email || '',
    tourName: title || '',
    fullName: '',
    phone: '',
    guestSize: 1,
    bookAt: '',
    hotelType: 'fiveStar',
    flightClass: 'economy'
  });
  const [totalAmount, setTotalAmount] = useState(0);

  const handleChange = e => {
    setBooking(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = 10;
  useEffect(() => {
    const fiveStarPrice = hotelOptions.fiveStar || 0;
    const threeStarPrice = hotelOptions.threeStar || 0;
    const economyPrice = flightOptions.economy || 0;
    const businessPrice = flightOptions.business || 0;
    const hotelPrice = booking.hotelType === 'fiveStar' ? fiveStarPrice : threeStarPrice;
    const flightPrice = booking.flightClass === 'economy' ? economyPrice : businessPrice;
    const calculatedTotal = (Number(price) * Number(booking.guestSize)) + hotelPrice + flightPrice + Number(serviceFee);

    setTotalAmount(calculatedTotal);
  }, [booking, hotelOptions, flightOptions, price]);
  const handleClick = async e => {
    e.preventDefault();

    if (!user) {
      return alert('Please sign in');
    }

    try {
      const res = await fetch(`${BASE_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(booking),
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }
      navigate('/thank-you');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='booking'>
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>${price} <span>/per person</span></h3>
        <span className="tour__rating d-flex align-items-center">
          <i className='ri-star-fill' style={{ 'color': 'var(--secondary-color)' }}></i>
          {avgRating ? avgRating : 'N/A'} ({reviews.length})
        </span>
      </div>
      <div className="booking__form">
        <h5>Information</h5>
        <Form className='booking__info-form' onSubmit={handleClick}>
          <FormGroup>
            <input
              type="text"
              placeholder='Full Name'
              id='fullName'
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="tel"
              placeholder='Phone'
              id='phone'
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className='d-flex align-items-center gap-3'>
            <input
              type="date"
              placeholder=''
              id='bookAt'
              required
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder='Guest'
              id='guestSize'
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor='hotelType'>Hotel Type</label>
            <select
              id='hotelType'
              value={booking.hotelType}
              onChange={handleChange}
            >
              <option value='fiveStar'>5 Star - ${hotelOptions.fiveStar || 0}</option>
              <option value='threeStar'>3 Star - ${hotelOptions.threeStar || 0}</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label htmlFor='flightClass'>Flight Class</label>
            <select
              id='flightClass'
              value={booking.flightClass}
              onChange={handleChange}
            >
              <option value='economy'>Economy - ${flightOptions.economy || 0}</option>
              <option value='business'>Business - ${flightOptions.business || 0}</option>
            </select>
          </FormGroup>
        </Form>
      </div>
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className='border-0 px-0'>
            <h5 className='d-flex align-items-center gap-1'>${price} <i className='ri-close-line'></i> 1 person</h5>
            <span>${price}</span>
          </ListGroupItem>
          <ListGroupItem className='border-0 px-0'>
            <h5>Service charge</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className='border-0 px-0 total'>
            <h5>Total</h5>
            <span>${totalAmount}</span>
          </ListGroupItem>
        </ListGroup>

        <Button className='btn primary__btn w-100 mt-4' onClick={handleClick}>Book Now</Button>
      </div>
    </div>
  );
};

export default Booking;
