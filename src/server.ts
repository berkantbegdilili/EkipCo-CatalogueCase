import App from '@/app';
import AuthRoute from '@routes/auth.route';
import UserRoute from '@routes/user.route';
import CategoryRoute from '@routes/category.route';
import ProductRoute from '@routes/product.route';
import SliderRoute from '@routes/slider.route';

process.env['KEYS_DIR'] = __dirname + '/../keys';

const app = new App([new AuthRoute(), new UserRoute(), new CategoryRoute(), new ProductRoute(), new SliderRoute()]);

app.listen();