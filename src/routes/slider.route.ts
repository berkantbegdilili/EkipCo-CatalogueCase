import { Router } from 'express';
import SliderController from '@controllers/slider.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class SliderRoute implements Routes {
    public path = '/sliders';
    public router = Router();
    public sliderController = new SliderController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.sliderController.getSliders);
        this.router.post(`${this.path}`, authMiddleware, this.sliderController.createSlider);
    }
}

export default SliderRoute;
