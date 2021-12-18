import sliderModel from '@models/slider.model';
import { Slider } from '@interfaces/slider.interface';
import { isEmpty } from '@/utils/util';
import { HttpErrorException } from '@/exceptions/http-error.exception';

class SliderService {
    public sliders = sliderModel;
    
    public async findAllSlider(): Promise<Slider[]> {
        const sliders: Slider[] = await this.sliders.find().select({ _id: 0}).sort({ priority: 1 });
        return sliders;
    }

    public async createSlider(sliderData: Slider): Promise<Slider> {
        if (isEmpty(sliderData)) throw new HttpErrorException(400, "The body cannot be left blank.");
    
        const createSliderData: Slider = await this.sliders.create({ ...sliderData });
    
        return createSliderData;
    }
}

export default SliderService;