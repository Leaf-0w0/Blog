---
title: Python笔记 | 第8章 面向对象/编程题
published: 2024-12-12
description: Python面向对象编程题笔记
tags:
  - Python
category: Tutorial
draft: false
image: ./post-cover/153313.webp
---
1.设计一个Circle（圆）类，该类中包括属性radius（半径），还包括__init__()、get_perimeter()（求周长）和get_area()（求面积）共三个方法。
设计完成后，创建Circle类的对象求圆的周长和面积。
```python
#有参构造
class Circle:
    def __init__(self, radius):
        self.radius = radius
    def get_perimeter(self):
        return 2 * 3.14 * self.radius
    def get_area(self):
        return 3.14 * self.radius * self.radius
circle = Circle(5)
print(f'圆的周长：{circle.get_perimeter()}')
print(f'圆的面积：{circle.get_area()}')
#无参构造
class Circle:
    def __init__(self):
        self.radius = 5
    def get_perimeter(self):
        return 2 * 3.14 * self.radius
    def get_area(self):
        return 3.14 * self.radius * self.radius
circle = Circle()
print(f'圆的周长：{circle.get_perimeter()}')
print(f'圆的面积：{circle.get_area()}')
```
2.设计一个Course（课程）类，该类中包括number（编号）、name（名称）、teacher（任课教师）、location（上课地点）共4个属性，其中location是私有属性；
还包括__init__()、show_info()（显示课程信息）共两个方法。设计完成后，创建Course类的对象显示课程的信息。
```python
#有参构造
class Course:
    def __init__(self,number,name,teacher,location):
        self.number=number
        self.name=name
        self.teacher=teacher
        self.__location=location
    def show_info(self):
        print(f'编号：{self.number}')
        print(f'名称：{self.name}')
        print(f'任课教师：{self.teacher}')
        print(f'上课地点：{self.__location}')        
course=Course('001','程序设计','江','信工楼407')
course.show_info()
#无参构造
class Course:
    def __init__(self):
        self.number='001'
        self.name='程序设计'
        self.teacher='江'
        self.__location='信工楼407'
    def show_info(self):
        print(f'编号：{self.number}')
        print(f'名称：{self.name}')
        print(f'任课教师：{self.teacher}')
        print(f'上课地点：{self.__location}')
course=Course()
course.show_info()
```
