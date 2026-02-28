import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import api from '../api';
import './ReviewsPage.css';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formName, setFormName] = useState('');
    const [formRating, setFormRating] = useState(5);
    const [formText, setFormText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState('');

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews');
            // Ensure 90 reviews display correctly
            setReviews(res.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess('');
        try {
            const profileUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formName)}&background=random`;
            await api.post('/reviews', {
                reviewerName: formName,
                rating: formRating,
                reviewText: formText,
                profilePhotoUrl: profileUrl
            });
            setSubmitSuccess('Thank you! Your feedback has been posted.');
            setFormName('');
            setFormText('');
            setFormRating(5);
            fetchReviews(); // Refresh the list to show the new review at the top
        } catch (err) {
            console.error('Submission failed', err);
        } finally {
            setIsSubmitting(false);
            // Hide success message after 4s
            setTimeout(() => setSubmitSuccess(''), 4000);
        }
    };

    return (
        <div className="reviews-page">
            <div className="reviews-page-header glass-panel">
                <h1>Slooks <span className="text-gold">Wall of Love</span></h1>
                <p>Read all {reviews.length}+ reviews from our amazing clients in Ballari</p>
                <div className="overall-rating">
                    <h2>3.8</h2>
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={24} fill={i < 4 ? "var(--color-gold)" : "transparent"} color="var(--color-gold)" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="reviews-content-wrapper">
                {/* Feedback Form Side */}
                <div className="feedback-form-container glass-panel">
                    <h3>Leave Your Feedback</h3>
                    <p>We value your experience at Slooks Unisex Salon.</p>

                    {submitSuccess && <div className="success-banner">{submitSuccess}</div>}

                    <form onSubmit={handleSubmit} className="feedback-form">
                        <div className="form-group">
                            <label>Your Name</label>
                            <input
                                type="text"
                                required
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Rate Your Experience</label>
                            <div className="rating-selector">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        className="star-btn"
                                        onClick={() => setFormRating(star)}
                                    >
                                        <Star
                                            size={28}
                                            fill={star <= formRating ? "var(--color-gold)" : "transparent"}
                                            color="var(--color-gold)"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Your Feedback</label>
                            <textarea
                                required
                                value={formText}
                                onChange={(e) => setFormText(e.target.value)}
                                rows="4"
                                placeholder="Tell us what you loved..."
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary form-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Posting...' : <><Send size={18} /> Post Review</>}
                        </button>
                    </form>
                </div>

                {/* 90 Reviews Grid Side */}
                <div className="reviews-large-grid">
                    {loading ? (
                        <div className="loading-state">Loading all 90 reviews...</div>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="review-card glass-panel hover-3d">
                                <div className="review-top">
                                    <img src={review.profilePhotoUrl} alt={review.reviewerName} className="reviewer-img" />
                                    <div>
                                        <h4 className="reviewer-name">{review.reviewerName}</h4>
                                        <span className="review-date">{new Date(review.reviewDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="review-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < review.rating ? "var(--color-gold)" : "transparent"}
                                            color={i < review.rating ? "var(--color-gold)" : "var(--color-beige)"}
                                        />
                                    ))}
                                </div>
                                <p className="review-text">"{review.reviewText}"</p>
                                <div className="google-watermark">G</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;
