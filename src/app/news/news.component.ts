import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

    images: any[];

    ngOnInit() {
        this.images = [];
        this.images.push({source:'assets/demo/images/slides/galleria1.jpg', alt:'Description for Image 1', title:'Title 1'});
        this.images.push({source:'assets/demo/images/slides/galleria2.jpg', alt:'Description for Image 2', title:'Title 2'});
        this.images.push({source:'assets/demo/images/slides/galleria3.jpg', alt:'Description for Image 3', title:'Title 3'});
        this.images.push({source:'assets/demo/images/slides/galleria4.jpg', alt:'Description for Image 4', title:'Title 4'});
        this.images.push({source:'assets/demo/images/slides/galleria5.jpg', alt:'Description for Image 5', title:'Title 5'});
        this.images.push({source:'assets/demo/images/slides/galleria6.jpg', alt:'Description for Image 6', title:'Title 6'});
        this.images.push({source:'assets/demo/images/slides/galleria7.jpg', alt:'Description for Image 7', title:'Title 7'});
        this.images.push({source:'assets/demo/images/slides/galleria8.jpg', alt:'Description for Image 8', title:'Title 8'});
        this.images.push({source:'assets/demo/images/slides/galleria9.jpg', alt:'Description for Image 9', title:'Title 9'});
        this.images.push({source:'assets/demo/images/slides/galleria10.jpg', alt:'Description for Image 10', title:'Title 10'});
        this.images.push({source:'assets/demo/images/slides/galleria11.jpg', alt:'Description for Image 11', title:'Title 11'});
        this.images.push({source:'assets/demo/images/slides/galleria12.jpg', alt:'Description for Image 12', title:'Title 12'});
    }

}
