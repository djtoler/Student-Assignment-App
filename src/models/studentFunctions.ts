
export function deleteAssignment(array:any, studentEmail:any, req:any, res:any ) {
    let id = parseInt(req.params.id);
    let confirmedStudent = Student.findOne({email: studentEmail});
    confirmedStudent
    .then((student: typeof Student) => {
        let assign;
        for(let i=0; i < array.length; i++)
        if(array[i].id == id) {
            assign = array[i];
            assign.remove();
            return student.save()
            .then(() => {
                res.render('assignmentHome', {
                    studentName: student.name,
                    arrayOfAssignments: student.assignments,
                    myAverageScore: myAverageScore1(student.assignments) + "%"
                })
            })
        }
    })
}

export function myAverageScore1 (array:any) {
    let totalScores = 0;
    let totalPossible = 0;
    let myAverageScore: string | number;
    for (let i = 0; i < array.length; i++) {
        if (array[i].completed === "true") {
            totalScores = totalScores + parseInt(array[i].score);
            totalPossible = totalPossible + array[i].total;
        }
    } 
    myAverageScore  = parseFloat(((totalScores / totalPossible) * 100).toFixed(1)) ;
    return myAverageScore;
};
