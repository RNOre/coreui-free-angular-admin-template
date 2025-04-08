import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';
import {PaginationComponent} from "../widgets/pagination/pagination.component";
import {PaginationMetaInterface} from "../interfaces/global";

@Directive({
  standalone: true,
  selector: '[pagination]'
})
export class PaginationDirective implements OnInit {
  @Input() paginationMeta!: PaginationMetaInterface;
  @Output() pageChange = new EventEmitter<number>();
  constructor(
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver
      .resolveComponentFactory(PaginationComponent);
    const componentRef = this.viewContainerRef.createComponent(componentFactory);

    componentRef.instance.meta = this.paginationMeta;

    componentRef.instance.pageChangeEvent.subscribe((page) => {
      this.pageChange.emit(page);
    })

    const host = this.element.nativeElement;
    // host?.insertAfter(componentRef.location.nativeElement, host.firstChild);
  }
}
