export const chartService = {
  // Calculate overall trend data for class performance
  calculateOverallTrend: (grades, assignments) => {
    const assignmentsByDate = assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const categories = assignmentsByDate.map(a => a.title.substring(0, 15) + (a.title.length > 15 ? '...' : ''));
    
    const assignmentScores = [];
    const testScores = [];
    const overallScores = [];
    
    assignmentsByDate.forEach(assignment => {
      const assignmentGrades = grades.filter(g => g.assignmentId === assignment.Id);
      
      if (assignmentGrades.length > 0) {
        const averageScore = assignmentGrades.reduce((sum, grade) => sum + grade.score, 0) / assignmentGrades.length;
        const percentage = (averageScore / assignment.totalPoints) * 100;
        
        if (assignment.category === 'Test' || assignment.category === 'Quiz') {
          testScores.push(Math.round(percentage));
          assignmentScores.push(null);
        } else {
          assignmentScores.push(Math.round(percentage));
          testScores.push(null);
        }
        
        overallScores.push(Math.round(percentage));
      } else {
        assignmentScores.push(null);
        testScores.push(null);
        overallScores.push(null);
      }
    });
    
    return {
      categories,
      assignments: assignmentScores,
      tests: testScores,
      overall: overallScores
    };
  },

  // Calculate individual student trend data
  calculateStudentTrend: (studentId, grades, assignments) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    const studentAssignments = assignments.filter(a => 
      studentGrades.some(g => g.assignmentId === a.Id)
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    const categories = studentAssignments.map(a => a.title.substring(0, 10) + '...');
    const scores = studentAssignments.map(assignment => {
      const grade = studentGrades.find(g => g.assignmentId === assignment.Id);
      return grade ? Math.round((grade.score / assignment.totalPoints) * 100) : 0;
    });
    
    const average = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    
    // Determine trend direction
    let trend = 'stable';
    if (scores.length >= 2) {
      const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 5) trend = 'up';
      else if (secondAvg < firstAvg - 5) trend = 'down';
    }
    
    return {
      categories,
      scores,
      average,
      trend
    };
  },

  // Calculate category-based trends
  calculateCategoryTrends: (grades, assignments) => {
    const categories = [...new Set(assignments.map(a => a.category))];
    const assignmentsByCategory = {};
    
    categories.forEach(category => {
      assignmentsByCategory[category] = assignments
        .filter(a => a.category === category)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    });
    
    return categories.map(category => {
      const categoryAssignments = assignmentsByCategory[category];
      const data = categoryAssignments.map(assignment => {
        const assignmentGrades = grades.filter(g => g.assignmentId === assignment.Id);
        
        if (assignmentGrades.length > 0) {
          const averageScore = assignmentGrades.reduce((sum, grade) => sum + grade.score, 0) / assignmentGrades.length;
          return Math.round((averageScore / assignment.totalPoints) * 100);
        }
        return 0;
      });
      
      return {
        name: category,
        data: data
      };
    });
  },

  // Get category trend labels
  getCategoryTrendLabels: (assignments) => {
    const categories = [...new Set(assignments.map(a => a.category))];
    const maxAssignments = Math.max(...categories.map(category => 
      assignments.filter(a => a.category === category).length
    ));
    
    return Array.from({ length: maxAssignments }, (_, i) => `Assignment ${i + 1}`);
  },

  // Calculate trend data for all students
  calculateTrendData: (students, grades, assignments) => {
    return students.map(student => {
      const studentTrend = this.calculateStudentTrend(student.Id, grades, assignments);
      return {
        studentId: student.Id,
        name: `${student.firstName} ${student.lastName}`,
        trend: studentTrend,
        grade: student.grade
      };
    });
  },

  // Get performance statistics
  getPerformanceStats: (grades, assignments) => {
    const totalAssignments = assignments.length;
    const totalGrades = grades.length;
    const averageScore = totalGrades > 0 ? 
      grades.reduce((sum, grade) => sum + grade.score, 0) / totalGrades : 0;
    
    const gradeDistribution = {
      excellent: grades.filter(g => {
        const assignment = assignments.find(a => a.Id === g.assignmentId);
        return assignment && (g.score / assignment.totalPoints) * 100 >= 90;
      }).length,
      good: grades.filter(g => {
        const assignment = assignments.find(a => a.Id === g.assignmentId);
        const percentage = assignment ? (g.score / assignment.totalPoints) * 100 : 0;
        return percentage >= 80 && percentage < 90;
      }).length,
      satisfactory: grades.filter(g => {
        const assignment = assignments.find(a => a.Id === g.assignmentId);
        const percentage = assignment ? (g.score / assignment.totalPoints) * 100 : 0;
        return percentage >= 70 && percentage < 80;
      }).length,
      needsImprovement: grades.filter(g => {
        const assignment = assignments.find(a => a.Id === g.assignmentId);
        const percentage = assignment ? (g.score / assignment.totalPoints) * 100 : 0;
        return percentage < 70;
      }).length
    };
    
    return {
      totalAssignments,
      totalGrades,
      averageScore,
      gradeDistribution
    };
  }
};