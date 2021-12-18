import { NextFunction, Request, Response } from 'express';
import sliderService from '@/services/slider.service';
import { Slider } from '@/interfaces/slider.interface';

class SliderController {
    public sliderService = new sliderService();

    public getSliders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllSlidersData: Slider[] = await this.sliderService.findAllSlider();

            res.status(200).json(findAllSlidersData);
        } catch (error) {
            next(error);
        }
    };

    public createSlider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sliderData: Slider = req.body;
            const createSliderData: Slider = await this.sliderService.createSlider(sliderData);

            res.status(201).json(createSliderData);
        } catch (error) {
            next(error);
        }
    };
}

export default SliderController;
