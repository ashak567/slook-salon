import Reviews from '../components/Reviews';
import './ReviewsPage.css';

const ReviewsPage = () => {
    return (
        <div className="reviews-page-container">
            <div className="reviews-page-header">
                <h1>Client <span className="text-gold">Reviews</span></h1>
                <p>See why Ballari loves Slooks</p>
            </div>
            <Reviews />
        </div>
    );
};

export default ReviewsPage;
