import {Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy } from '@angular/core';
import {CdkPortal,DomPortalHost} from '@angular/cdk/portal';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {

  @ViewChild(CdkPortal) portal: CdkPortal;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector) { }

    private externalWindow = null;

  ngOnInit(): void {
     // STEP 4: create an external window
     this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

     // STEP 5: create a PortalHost with the body of the new window document    
     const host = new DomPortalHost(
       this.externalWindow.document.body,
       this.componentFactoryResolver,
       this.applicationRef,
       this.injector
       );
 
     // STEP 6: Attach the portal
     host.attach(this.portal);
  }

  ngOnDestroy(){
    // STEP 7: close the window when this component destroyed
    this.externalWindow.close()
  }

}
