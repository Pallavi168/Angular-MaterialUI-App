import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
  
  department = ["Dev", "QA", "Prod"]
  employeeForm !: FormGroup;
  actionBtn : string = "Save";

  constructor(private formBuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef:  MatDialogRef<DialogComponent>) {}

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      employeeName: ['', Validators.required],
      employeeType: ['', Validators.required],
      date: ['', Validators.required],
      department: ['', Validators.required],
      salaryInfo: [''],
      comment: ['', Validators.required]
    });

    if(this.editData){
      this.actionBtn = "Update";
      this.employeeForm.controls['employeeName'].setValue(this.editData.employeeName);
      this.employeeForm.controls['employeeType'].setValue(this.editData.employeeType);
      this.employeeForm.controls['date'].setValue(this.editData.date);
      this.employeeForm.controls['department'].setValue(this.editData.department);
      this.employeeForm.controls['comment'].setValue(this.editData.comment);
    }
  }

  addEmployee(){
    //console.log(this.employeeForm.value);
    if(!this.editData){
      if(this.employeeForm.valid){
        this.api.postEmployee(this.employeeForm.value)
        .subscribe({
          next:(res)=>{
            alert("Employee Added Successfully!");
            this.employeeForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error while adding employee")
          }
        })
      }
    }else {
      this.updateEmployee();
    }
  }
  updateEmployee(){
    this.api.putEmployee(this.employeeForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Updated Successfully");
        this.employeeForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the record");
      }
    })
  }
}
